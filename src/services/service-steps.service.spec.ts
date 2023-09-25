import { TestBed } from '@angular/core/testing';

import { ServiceStepsService } from './service-steps.service';

describe('ServiceStepsService', () => {
  let service: ServiceStepsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServiceStepsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
