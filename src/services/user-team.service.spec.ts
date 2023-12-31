import { TestBed } from '@angular/core/testing';

import { UserTeamService } from './user-team.service';

describe('UserTeamService', () => {
  let service: UserTeamService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserTeamService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
