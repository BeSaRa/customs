import { TestBed } from '@angular/core/testing';

import { OffenderViolationService } from './offender-violation.service';

describe('OffenderViolationService', () => {
  let service: OffenderViolationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OffenderViolationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
