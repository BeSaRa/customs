import { TokenInterceptor } from '@http-interceptors/token.interceptor';
import { Provider } from '@angular/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpExceptionHandlerInterceptor } from '@http-interceptors/http-exception-handler.interceptor';
import { ProgressInterceptor } from '@http-interceptors/progress.interceptor';

export const httpInterceptors: Provider[] = [
  {
    provide: HTTP_INTERCEPTORS,
    multi: true,
    useClass: ProgressInterceptor,
  },
  {
    provide: HTTP_INTERCEPTORS,
    multi: true,
    useClass: TokenInterceptor,
  },
  {
    provide: HTTP_INTERCEPTORS,
    multi: true,
    useClass: HttpExceptionHandlerInterceptor,
  },
];
