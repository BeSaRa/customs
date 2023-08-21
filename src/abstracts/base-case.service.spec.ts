import { TestBed } from '@angular/core/testing';

import { BaseCaseService } from './base-case.service';

describe('BaseCaseService', () => {
  let service: BaseCaseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BaseCaseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
