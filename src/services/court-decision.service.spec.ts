import { TestBed } from '@angular/core/testing';

import { CourtDecisionService } from './court-decision.service';

describe('CourtDecisionService', () => {
  let service: CourtDecisionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CourtDecisionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
