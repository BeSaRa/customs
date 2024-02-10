import { TestBed } from '@angular/core/testing';
import { CanDeactivateFn } from '@angular/router';

import { investigationCanDeactivateGuard } from './investigation-can-deactivate.guard';

describe('canLeaveGuard', () => {
  const executeGuard: CanDeactivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() =>
      investigationCanDeactivateGuard(...guardParameters),
    );

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
