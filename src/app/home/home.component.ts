import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { VotingService } from '../voting.service';
import { getAnalytics } from "firebase/analytics";
import { AnalyticsLoggingService, EventType } from '../analytics-logging.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  private currentSession: string;
  private currentUserId: string;
  pointingOption: string;
  invalidModel: boolean;

  constructor(private votingService: VotingService, private router: Router, private route: ActivatedRoute, private analyticsService : AnalyticsLoggingService) { }

  ngOnInit(): void {
    this.invalidModel = false;
    this.votingService.initializeStuff();
    this.analyticsService.initializeStuff();
    this.analyticsService.logPageView("Home");
  }

  createVotingSession(): void{
    if(this.pointingOption){
      this.analyticsService.logEvent(EventType.SelectContent, "button", "createVotingSession");
      this.invalidModel = false;
      this.votingService.createNewSession(this.pointingOption).then((sessionId) => {
        this.currentSession = sessionId;
        this.router.navigate(['/voting', { id: this.currentSession }], { state: { votingType: this.pointingOption, isOwner: true}});
      });
    }
    else{
      this.analyticsService.logEvent(EventType.Exception, "error", "noPointingOptionSelected");
      this.invalidModel = true;
    }
  }

  optionChanged(): void{
    if(this.pointingOption){
      this.analyticsService.logEvent(EventType.SelectItem, "pointingOption", this.pointingOption);
      this.invalidModel = false;
    }
  }
}
