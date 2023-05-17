import { TestBed } from '@angular/core/testing';

import { InternalUserService } from './internal-user.service';

describe('InternalUserService', () => {
  let service: InternalUserService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InternalUserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
