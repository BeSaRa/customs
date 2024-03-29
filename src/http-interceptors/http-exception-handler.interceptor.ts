import { inject, Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { ExceptionHandlerService } from '@services/exception-handler.service';
import { NO_ERROR_HANDLE } from '@http-contexts/tokens';

@Injectable()
export class HttpExceptionHandlerInterceptor implements HttpInterceptor {
  private readonly handler = inject(ExceptionHandlerService);

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler,
  ): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError(err => {
        !request.context.get(NO_ERROR_HANDLE) &&
          this.handler.httpExceptionHandle(err);
        return throwError(err);
      }),
    );
  }
}
