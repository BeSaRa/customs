import { inject, Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { ExceptionHandlerService } from '@services/exception-handler.service';

@Injectable()
export class HttpExceptionHandlerInterceptor implements HttpInterceptor {
  private readonly handler = inject(ExceptionHandlerService);

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((err) => {
        this.handler.httpExceptionHandle(err);
        return throwError(err);
      })
    );
  }
}
