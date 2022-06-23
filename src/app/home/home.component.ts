import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { VotingService } from '../voting.service';

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

  constructor(private votingService: VotingService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.invalidModel = false;
    this.votingService.initializeStuff();
  }

  createVotingSession(): void{
    if(this.pointingOption){
      this.invalidModel = false;
      this.votingService.createNewSession(this.pointingOption).then((sessionId) => {
        this.currentSession = sessionId;
        this.router.navigate(['/voting', { id: this.currentSession }], { state: { votingType: this.pointingOption, isOwner: true}});
      });
    }
    else{
      this.invalidModel = true;
    }
  }

  optionChanged(): void{
    if(this.pointingOption){
      this.invalidModel = false;
    }
  }
}
