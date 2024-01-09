import { TestBed } from '@angular/core/testing';

import { SuspendedEmployeeService } from './suspended-employee.service';

describe('SuspendedEmployeeService', () => {
  let service: SuspendedEmployeeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SuspendedEmployeeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
