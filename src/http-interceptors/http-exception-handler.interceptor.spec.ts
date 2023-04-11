import { TestBed } from '@angular/core/testing';

import { HttpExceptionHandlerInterceptor } from './http-exception-handler.interceptor';

describe('HttpExceptionHandlerInterceptor', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      providers: [HttpExceptionHandlerInterceptor],
    })
  );

  it('should be created', () => {
    const interceptor: HttpExceptionHandlerInterceptor = TestBed.inject(
      HttpExceptionHandlerInterceptor
    );
    expect(interceptor).toBeTruthy();
  });
});
