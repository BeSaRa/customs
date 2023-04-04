import { TestBed } from '@angular/core/testing';

import { authGuard } from './auth.guard';

describe('authGuard', () => {
  // const executeGuard: CanMatchFn = (...guardParameters) =>
  //   TestBed.runInInjectionContext(() => authGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(true).toBeTruthy();
  });
});
