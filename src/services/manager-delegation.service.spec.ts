import { TestBed } from '@angular/core/testing';

import { ManagerDelegationService } from './manager-delegation.service';

describe('ManagerDelegationService', () => {
  let service: ManagerDelegationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ManagerDelegationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
