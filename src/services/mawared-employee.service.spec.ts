import { TestBed } from '@angular/core/testing';

import { MawaredEmployeeService } from './mawared-employee.service';

describe('MawaredEmployeeService', () => {
  let service: MawaredEmployeeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MawaredEmployeeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
