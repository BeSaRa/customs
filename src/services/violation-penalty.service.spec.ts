import { TestBed } from '@angular/core/testing';

import { ViolationPenaltyService } from './violation-penalty.service';
  
describe('ViolationPenaltyService', () => {
  let service: ViolationPenaltyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ViolationPenaltyService);
  });
  
  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
