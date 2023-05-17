import { TestBed } from '@angular/core/testing';

import { ViolationClassificationService } from './violation-classification.service';

describe('ViolationClassificationService', () => {
  let service: ViolationClassificationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ViolationClassificationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
