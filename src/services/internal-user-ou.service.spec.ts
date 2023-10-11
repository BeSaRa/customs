import { TestBed } from '@angular/core/testing';

import { InternalUserOUService } from './internal-user-ou.service';
  
describe('InternalUserOUService', () => {
  let service: InternalUserOUService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InternalUserOUService);
  });
  
  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
