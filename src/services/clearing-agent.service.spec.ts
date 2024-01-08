import { TestBed } from '@angular/core/testing';

import { ClearingAgentService } from './clearing-agent.service';

describe('ClearingAgentService', () => {
  let service: ClearingAgentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClearingAgentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
