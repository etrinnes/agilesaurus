import { Component, OnInit } from '@angular/core';
import { VotingService } from '../voting.service';
import { ActivatedRoute, Router } from '@angular/router';
import { VoteModel, VoteOption, VoteType } from '../session';
import { VoteTypeService } from '../vote-type.service';
import * as bootstrap from "bootstrap";
import { ChartType } from 'angular-google-charts';

@Component({
  selector: 'app-voting',
  templateUrl: './voting.component.html',
  styleUrls: ['./voting.component.scss']
})
export class VotingComponent implements OnInit {
  private currentSession: string;
  private currentUserId: string;
  private votingType: VoteType;
  isOwner: boolean;
  statusText : string = "Loading";
  copyTitle : string = "Copy to Clipboard";
  url: string = "";
  voteType : VoteType;
  voteOptions: VoteOption[];
  votes: { [name: string]: number } = {};
  isSessionActive : boolean;
  playerCount: number;
  numberOfSubmittedVotes: number;
  totalVotes: VoteModel[];
  isLoading: boolean;
  shouldDisplayCards: boolean;
  selectedVote : string;

  constructor(private votingService: VotingService, private voteTypeService: VoteTypeService, private router: Router, private route: ActivatedRoute) { 
    let stuff : any = this.router.getCurrentNavigation()?.extras.state;
    this.currentSession = stuff?.id;
    this.isOwner = stuff?.isOwner;
    this.votingType = stuff?.votingType;
    this.isLoading = true;
  }

  ngOnInit(): void {
   this.selectedVote = "";
   let savedSession = this.getCookieValue("agilesaurusSessionId");
   let savedUserId = this.getCookieValue("agilesaurusUserId");
   let savedisOwner = this.getCookieValue("agilesaurusIsOwner");

   let tooltips = document.querySelectorAll('[data-toggle="tooltip"]');
   for(let i = 0; i < tooltips.length; i++) {
     let tooltip = new bootstrap.Tooltip(tooltips[i]);
   }   

    this.route.params.subscribe((params) => {
      this.currentSession = params['id'];
    });

    this.url = window.location.href;

    this.isValidSession(this.currentSession).then((isValid : boolean) => {
      if(!isValid)
      {
        this.router.navigate(['/notfound']);
      }
      else{
        if(savedSession && (savedSession == this.currentSession) && savedUserId){
          this.isOwner = savedisOwner == 'true';
          this.currentSession = savedSession;
          this.currentUserId = savedUserId;
          this.isSessionActive = true;
          this.statusText = `Joined session ${this.currentSession}`;
          this.handleSessionData(this.votingType, false);
          // this.votingService.initializeStuff();
          // this.votingService.getSessionType(this.currentSession).then((sessionType) => {
          //   this.votingType = sessionType as VoteType;
          //   this.totalVotes = this.voteTypeService.getVoteModel(this.votingType); // is this needed?
          //   this.voteOptions = this.voteTypeService.getVoteOptions(this.votingType);
          //   this.shouldDisplayCards = this.votingType == VoteType.Dinos; 
          //   this.isLoading = false;
          //   this.listenForSessionData();
          // });
        }
        else {
          deleteCookies();
          this.playerCount = 0;
          this.numberOfSubmittedVotes = 0;
          this.route.params.subscribe((params) => {
            this.currentSession = params['id'];
          });
          this.handleSessionData(this.votingType, true);
    
          // this.votingService.initializeStuff();
    
          // this.votingService.getSessionType(this.currentSession).then((sessionType) => {
          //   this.votingType = sessionType as VoteType;
          //   this.totalVotes = this.voteTypeService.getVoteModel(this.votingType);
          //   this.voteOptions = this.voteTypeService.getVoteOptions(this.votingType);
          //   this.shouldDisplayCards = this.votingType == VoteType.Dinos; 
    
          //   this.listenForSessionData();
    
          //   this.joinSession(this.currentSession, this.isOwner);
          // });
        }
      }
    });
  }

  async isValidSession(sessionId : string) : Promise<boolean>{
    this.votingService.initializeStuff();
    return await this.votingService.isValidSession(sessionId);
  }

  handleSessionData(sessionType: string, isNewSession:boolean): void{
    this.votingService.initializeStuff();
    this.votingService.getSessionType(this.currentSession).then((sessionType) => {
      this.votingType = sessionType as VoteType;
      this.totalVotes = this.voteTypeService.getVoteModel(this.votingType);
      this.voteOptions = this.voteTypeService.getVoteOptions(this.votingType);
      this.shouldDisplayCards = this.votingType == VoteType.Dinos; 

      this.listenForSessionData();

      if(isNewSession){
        this.joinSession(this.currentSession, this.isOwner);
      }
      else{
        this.isLoading = false;
      }
    });
  }

  joinSession(sessionId: string, isOwner: boolean = false): void{
    if(sessionId == ""){
      sessionId = this.currentSession;
    }
    this.votingService.addNewUser(sessionId, isOwner).then((userId) => {
      this.currentUserId = userId;
      this.statusText = `Joined session ${this.currentSession}`;
      this.isSessionActive = true;

      this.setCookie(sessionId, isOwner, userId);

      setTimeout(() => {
        this.isLoading = false;
      }, 250);
    })
  }

  addVote(vote: string) : void{
    this.selectedVote = vote;
    this.votingService.addVote(this.currentSession, this.currentUserId, vote);
  }

  endVotingSession(): void{
    this.votingService.endSession(this.currentSession).then((isSuccess) => {
      if(isSuccess){
        this.isSessionActive = false;
      }
    })
  }

  resetVotes(): void{
    this.isLoading = true;
    this.votingService.resetVotes(this.currentSession).then((status : boolean) => {
      this.isLoading = false;
      this.isSessionActive = true;
    });
  }

  listenForSessionData(): void{
    this.votingService.listenForDataChanges(this.currentSession);

    this.votingService.getSessionSubject().asObservable().subscribe(val => {
      this.playerCount = val.userCount;
      this.numberOfSubmittedVotes = val.voteCount;
      this.isSessionActive = val.isActive;
      this.totalVotes = val.votes;

     // this.totalVotes = this.sortVotes(this.totalVotes);

      if(!this.isSessionActive){
        this.selectedVote = "";
      }
    })
  }

  setCookie(sessionId: string, isOwner: boolean, userId: string): void {
    var date = new Date();
    var time = date.getTime();
    time += 3600 * 1000;
    date.setTime(time);
    document.cookie = 'agilesaurusIsOwner=' + isOwner + '; expires=' + date.toUTCString() + '; path=/';
    document.cookie = 'agilesaurusSessionId=' + sessionId + '; expires=' + date.toUTCString() + '; path=/';
    document.cookie = 'agilesaurusUserId=' + userId + '; expires=' + date.toUTCString() + '; path=/';
  }

  getCookieValue(name: string) : string{
    return document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)')?.pop() || '';
  }

  getImage(name: string) : string{
    return this.voteTypeService.getImagePath(name);
  }

  copyUrlToClipboard() : void{
    navigator.clipboard.writeText(this.url);
  }

  sortVotes(votes: VoteModel[]) : VoteModel[]{
    let sortedArray: VoteModel[] = votes.sort((model1, model2) => {
      if (model1.votes > model2.votes) {
          return -1;
      }
      if (model1.votes < model2.votes) {
          return 1;
      }
      return 0;
    });
    return sortedArray;
  }
  

}

function deleteCookies() {
  document.cookie = 'agilesaurusIsOwner' + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
  document.cookie = 'agilesaurusSessionId' + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
  document.cookie = 'agilesaurusUserId' + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}

