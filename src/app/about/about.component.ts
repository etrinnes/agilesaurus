import { Component, OnInit } from '@angular/core';
import { AnalyticsLoggingService, EventType } from '../analytics-logging.service';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {

  constructor(private analyticsService : AnalyticsLoggingService) { }

  ngOnInit(): void {
    this.analyticsService.initializeStuff();
    this.analyticsService.logPageView("About");
  }

}
