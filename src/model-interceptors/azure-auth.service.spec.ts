import { TestBed } from '@angular/core/testing';

import { AzureAuthInterceptor } from './azure-auth.service';
describe('AzureAuthService', () => {
  let service: AzureAuthInterceptor;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AzureAuthInterceptor);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
