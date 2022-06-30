import { Component } from '@angular/core';
import { AnalyticsLoggingService, EventType } from './analytics-logging.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'agilesaurus-app';

  constructor(private analyticsService: AnalyticsLoggingService) {
    this.analyticsService.initializeStuff();
   }

  logClickEvent(contentType: string, itemId: string){
    this.analyticsService.logEvent(EventType.SelectContent, contentType, itemId);
  }
}
