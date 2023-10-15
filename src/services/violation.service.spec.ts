import { TestBed } from '@angular/core/testing';

import { ViolationService } from './violation.service';

describe('ViolationService', () => {
  let service: ViolationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ViolationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
