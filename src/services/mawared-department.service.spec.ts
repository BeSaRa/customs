import { TestBed } from '@angular/core/testing';

import { MawaredDepartmentService } from './mawared-department.service';

describe('MawaredDepartmentService', () => {
  let service: MawaredDepartmentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MawaredDepartmentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
