import { TestBed } from '@angular/core/testing';

import { ClearingAgencyService } from './clearing-agency.service';

describe('ClearingAgencyService', () => {
  let service: ClearingAgencyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClearingAgencyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
