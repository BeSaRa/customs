import { TestBed } from '@angular/core/testing';

import { InboxCounterService } from './inbox-counter.service';

describe('InboxCounterService', () => {
  let service: InboxCounterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InboxCounterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
