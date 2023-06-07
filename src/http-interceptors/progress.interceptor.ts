import { inject, Injectable } from '@angular/core';
import { HttpEvent, HttpEventType, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { catchError, filter, Observable, tap, throwError } from 'rxjs';
import { NgProgress } from 'ngx-progressbar';

@Injectable()
export class ProgressInterceptor implements HttpInterceptor {
  private inProgress: Map<string, unknown> = new Map<string, unknown>();
  progress = inject(NgProgress);

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    this.inProgress.set(request.url, undefined);
    this.inProgress.size && !this.progress.ref().isStarted && this.progress.ref().start();
    return next.handle(request).pipe(
      filter(value => value.type === HttpEventType.Response),
      tap(() => {
        this.inProgress.delete(request.url);
        !this.inProgress.size && this.progress.ref().complete();
      }),
      catchError(err => {
        this.inProgress.delete(request.url);
        !this.inProgress.size && this.progress.ref().complete();
        return throwError(err);
      })
    );
  }
}
