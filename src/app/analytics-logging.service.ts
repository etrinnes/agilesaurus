import { Injectable } from '@angular/core';
import { FirebaseApp, getApp, initializeApp } from "firebase/app";
import { Analytics, getAnalytics, logEvent } from "firebase/analytics";
import { Database, getDatabase, ref, set } from "firebase/database";
import { getFirestore, collection, getDocs, Firestore, addDoc, doc, setDoc, getDoc, DocumentData } from 'firebase/firestore/lite';
import { deleteField, onSnapshot, updateDoc } from "firebase/firestore";
import { Observable, Subject, Subscriber } from 'rxjs';
import { VoteModel, VoteType, VotingSession } from './session';
import { VoteTypeService } from './vote-type.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AnalyticsLoggingService {

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
  private analytics : Analytics;

  constructor() { }

  initializeStuff(): void{
    this.app = initializeApp(this.firebaseConfig);
    this.db = getFirestore(this.app);
    this.analytics = getAnalytics(this.app);
  }

  logEvent(eventType: EventType, contentType: string, itemId: string){
    this.analytics = getAnalytics();
    logEvent(this.analytics, eventType.toString(), {
      content_type: contentType,
      item_id: itemId
    });
  }

  logPageView(pageTitle : string){
    this.analytics = getAnalytics();
    logEvent(this.analytics, EventType.PageView.toString(), {
      page_title: pageTitle
    });
  }
}

export enum EventType{
  Exception = "exception",
  PageView = "page_view",
  SelectContent = "select_content",
  SelectItem = "select_item",
}