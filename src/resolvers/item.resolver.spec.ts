import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { itemResolver } from './item.resolver';
import { OpenedInfoContract } from '@contracts/opened-info-contract';

describe('itemResolver', () => {
  const executeResolver: ResolveFn<OpenedInfoContract | null> = (
    ...resolverParameters
  ) => TestBed.runInInjectionContext(() => itemResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
