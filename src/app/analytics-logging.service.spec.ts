import { TestBed } from '@angular/core/testing';

import { AnalyticsLoggingService } from './analytics-logging.service';

describe('AnalyticsLoggingService', () => {
  let service: AnalyticsLoggingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AnalyticsLoggingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
