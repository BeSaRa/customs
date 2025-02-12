import { TestBed } from '@angular/core/testing';

import { AzureAdminService } from './azure-admin.service';

describe('AzureAdminService', () => {
  let service: AzureAdminService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AzureAdminService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
