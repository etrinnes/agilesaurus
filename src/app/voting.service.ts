import { Injectable } from '@angular/core';
import { FirebaseApp, getApp, initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { Database, getDatabase, ref, set } from "firebase/database";
import { getFirestore, collection, getDocs, Firestore, addDoc, doc, setDoc, getDoc, DocumentData } from 'firebase/firestore/lite';
import { deleteField, onSnapshot, updateDoc } from "firebase/firestore";
import { Observable, Subject, Subscriber } from 'rxjs';
import { VoteModel, VoteType, VotingSession } from './session';
import { VoteTypeService } from './vote-type.service';
import { environment } from 'src/environments/environment';

@Injectable()
export class VotingService {

  firebaseConfig = {
    apiKey: environment.APIKEY,
    authDomain: environment.AUTHDOMAIN,
    databaseURL: environment.DBURL,
    projectId: environment.PROJECTID,
    storageBucket: environment.STORAGEBUCKET,
    messagingSenderId: environment.MESSAGINGSENDERID,
    appId: environment.APPID,
    measurementId: environment.MEASUREMENTID
  };

  private app: FirebaseApp;
  private db: Firestore;
  private currentSession: string;
  public userCount : Subject<number>;
  public voteCount : Subject<number>;
  public sessionData : Subject<VotingSession>;
  public sessionModel : VotingSession;

  constructor(private voteTypeService: VoteTypeService) { }

  initializeStuff(): void{

    this.app = initializeApp(this.firebaseConfig);
    this.db = getFirestore(this.app);
    this.userCount = new Subject();
    this.voteCount = new Subject();
    this.sessionData = new Subject();
    this.sessionModel = {
      userCount: 0,
      voteCount: 0,
      isActive: false,
      votes: [{point: '1', votes: 0}, {point: '2', votes: 0}, {point: '3', votes: 0}, {point: '5', votes: 0}, {point: '8', votes: 0}, {point: '13', votes: 0}]
    }
  }

  getSessionSubject(): Subject<VotingSession>{
    return this.sessionData;
  }

  async isValidSession(sessionId: string): Promise<boolean>{
    const docRef = doc(this.db, "sessions", sessionId);
    const docSnap = await getDoc(docRef);
    return docSnap.exists();
  }

  async sendMessage(enteredMessage: string = "", enteredName : string = "anonymous"){
    try{
      this.app = initializeApp(this.firebaseConfig);
      this.db = getFirestore(this.app);
      let docRef = await addDoc(collection(this.db, "messages"), {
        name: enteredName,
        message: enteredMessage,
      });
      return docRef.id;
    }catch(e){
      console.error("Error adding document: ", e);
      return "";
    }
  }

  async createNewSession(sessionType: string = "fib"): Promise<string>{

    try{
      let votes = this.voteTypeService.getVoteModel(sessionType);

      let docRef = await addDoc(collection(this.db, "sessions"), {
        sessionType: sessionType,
        isActive: true,
        totalVotes: votes,
        numberOfVotes: 0,
        numberOfPlayers: 0
      });
      this.sessionModel.isActive = true;
      this.currentSession = docRef.id;
      return docRef.id;

    }catch(e){
      console.error("Error adding document: ", e);
      return "";
    }
  }

  async updateSessionType(sessionId: string, sessionType: string = "fib"): Promise<string>{
    try{

      let docRef = doc(this.db, "sessions", sessionId);
      setDoc(docRef, {sessionType: sessionType}, {merge: true});

      return docRef.id;
    }
    catch(e){
      console.error("Error adding doc ", e);
      return "";
    }
  }

  async addNewUser(sessionId: string, isOwner: boolean = false): Promise<string>{
    try{
      let docRef = await addDoc(collection(this.db, "sessions", sessionId, "users"), {
        isOwner: isOwner
      })

      // Update total number of players:
      let sessionDocRef = doc(this.db, "sessions", sessionId);
      let docSnap = await getDoc(sessionDocRef);
      if (docSnap.exists()) {
        let data = docSnap.data();
        let currentNumberOfPlayers : number = data["numberOfPlayers"];
        let updatedValue = currentNumberOfPlayers + 1;
        setDoc(sessionDocRef, {numberOfPlayers: updatedValue}, {merge: true});
      }

      return docRef.id;
    }
    catch(e){
      console.error("Error adding doc ", e);
      return "";
    }
  }

  
  async addVote(sessionId: string, userId: string, submittedVote: number | string): Promise<void>{
    try{
      let docRef = doc(this.db, "sessions", sessionId, "users", userId);
      setDoc(docRef, {vote: submittedVote}, {merge: true});
      this.updateVoteTotals(sessionId, submittedVote);
    }
    catch(e){
      console.error("Error adding doc ", e);
    }
  }

  async resetVotes(sessionId: string) : Promise<boolean>{
    try{

      let querySnapshot = await getDocs(collection(this.db, "sessions", sessionId, "users"));
      querySnapshot.forEach(async (snap) => {
        let data = snap.data();
        let vote : string = data['vote'];

        let userDocRef = doc(this.db, "sessions", sessionId, "users", snap.id);
        await updateDoc(userDocRef, {vote: deleteField()});
      });


      let docRef = doc(this.db, "sessions", sessionId);
      let sessionType = await this.getSessionType(sessionId);
      let votes = this.voteTypeService.getVoteModel(sessionType);
      let voteCount = 0;

      await updateDoc(docRef, {totalVotes: votes});
      await updateDoc(docRef, {numberOfVotes: 0});
      await updateDoc(docRef, {isActive: true});

      this.sessionModel.voteCount = 0;
      this.sessionModel.votes = votes;
      this.sessionModel.isActive = true;

      return true;
    }
    catch(e){
      return false;
      console.error("Error resetting votes ", e);
    }
  }


  async getSessionType(sessionId: string): Promise<string>{
    try{
      let docRef = doc(this.db, "sessions", sessionId);
      let docSnap = await getDoc(docRef);
      let data = docSnap.data();
      if(data){
        return data['sessionType'];
      }
      return '';
    }
    catch(e){
      console.error("Error adding doc ", e);
      return "";
    }
  }

  async endSession(sessionId: string): Promise<boolean>{
    try{
      let docRef = doc(this.db, "sessions", sessionId);
      setDoc(docRef, {isActive: false}, {merge: true});
      return true;
    }
    catch(e){
      console.error("Error ending session ", e);
      return false;
    }
  }
  
  async listenForDataChanges(sessionId: string): Promise<void>{

    let docRef = doc(this.db, "sessions", sessionId);
    const unsub = onSnapshot(docRef, (docSnap) => {
      let data = docSnap.data();
      if(data){
        this.sessionModel.userCount = data["numberOfPlayers"];
        this.sessionModel.voteCount = data["numberOfVotes"];
        this.sessionModel.isActive = data["isActive"];
        this.sessionModel.votes = data["totalVotes"];
        this.sessionModel.voteCount = data["numberOfVotes"];
        this.sessionData.next(this.sessionModel);
      } 
    });
  }


  async updateVoteTotals(sessionId: string, submittedVote: number | string): Promise<boolean>{
    try{

      let sessionType = await this.getSessionType(sessionId);
      let votes = this.voteTypeService.getVoteModel(sessionType);
      let numberOfVotes = 0;

      let querySnapshot = await getDocs(collection(this.db, "sessions", sessionId, "users"));
      querySnapshot.forEach((doc) => {
        // console.log(doc.id, " => ", doc.data());
        let data = doc.data();
        let vote : string = data['vote'];

        votes.forEach(item => {
          if(item.point == vote){
            item.votes++;
            numberOfVotes++;
          }
        })
      });
      


      let docRef = doc(this.db, "sessions", sessionId);
      let docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        let data = docSnap.data();
        setDoc(docRef, {totalVotes: votes, numberOfVotes: numberOfVotes}, {merge: true});
        return true;
      }
      return false;
    }
    catch(e){
      console.error("error updating vote totals ", e);
      return false;
    }
  }
}

