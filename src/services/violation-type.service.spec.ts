import { TestBed } from '@angular/core/testing';

import { ViolationTypeService } from './violation-type.service';

describe('ViolationTypeService', () => {
  let service: ViolationTypeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ViolationTypeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
