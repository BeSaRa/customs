import { TestBed } from '@angular/core/testing';

import { InvestigationReportService } from './investigation-report.service';

describe('InvestigationReportService', () => {
  let service: InvestigationReportService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InvestigationReportService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
