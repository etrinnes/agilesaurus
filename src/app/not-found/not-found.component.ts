import { Component, OnInit } from '@angular/core';
import { AnalyticsLoggingService, EventType } from '../analytics-logging.service';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.scss']
})
export class NotFoundComponent implements OnInit {

  imagePath : string;

  constructor(private analyticsService : AnalyticsLoggingService) { }

  ngOnInit(): void {
    let randomNum =Math.floor(Math.random()*2);
    switch(randomNum){
      case 0:
        this.imagePath = "../../assets/images/baby-dino.svg";
        break;
      default:
        this.imagePath = "../../assets/images/dino-fossil.svg"
    }

    this.analyticsService.initializeStuff();
    this.analyticsService.logPageView("NotFound");
  }

}
