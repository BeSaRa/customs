import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { layoutWidgetResolver } from './layout-widget.resolver';

describe('layoutWidgetResolver', () => {
  const executeResolver: ResolveFn<boolean> = (...resolverParameters) =>
    TestBed.runInInjectionContext(() =>
      layoutWidgetResolver(...resolverParameters),
    );

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
