import { TestBed } from '@angular/core/testing';

import { InvestigationService } from './investigation.service';

describe('InvestigationService', () => {
  let service: InvestigationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InvestigationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
