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

  constructor(private votingService: VotingService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.votingService.initializeStuff();
  }

  createVotingSession(): void{
    console.log("in here");
    this.votingService.createNewSession(this.pointingOption).then((sessionId) => {
      this.currentSession = sessionId;
      //this.router.navigateByUrl('/voting', { state: { id: this.currentSession , votingType: this.pointingOption, isOwner: true}, id: this.currentSession});
      //this.router.navigateByUrl(['/voting', { id: this.currentSession }]);
      this.router.navigate(['/voting', { id: this.currentSession }], { state: { votingType: this.pointingOption, isOwner: true}});
    });


    //this.route.navigate(['voting']);
    //this.joinSession(this.currentSession, true);
  }

  // selectedPointingOption(): void{
  // }

}
