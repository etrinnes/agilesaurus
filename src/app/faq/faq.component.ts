import { Component, OnInit } from '@angular/core';
import { AnalyticsLoggingService, EventType } from '../analytics-logging.service';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.scss']
})
export class FaqComponent implements OnInit {

  constructor(private analyticsService : AnalyticsLoggingService) { }

  ngOnInit(): void {
    this.analyticsService.initializeStuff();
    this.analyticsService.logPageView("FAQ");
  }

}
