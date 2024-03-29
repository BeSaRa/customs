import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { LoadingService } from '@services/loading.service';
import { NO_LOADER_TOKEN } from '@http-contexts/tokens';

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {
  static requests: Map<string, HttpRequest<unknown>> = new Map();

  constructor(private loadingService: LoadingService) {}

  intercept(
    req: HttpRequest<unknown>,
    next: HttpHandler,
  ): Observable<HttpEvent<unknown>> {
    if (req.context.get(NO_LOADER_TOKEN)) {
      return next.handle(req);
    }
    this.loadingService.show();
    LoadingInterceptor.requests.set(req.urlWithParams, req.clone());
    return next.handle(req).pipe(
      finalize(
        (req => {
          return () => {
            if (LoadingInterceptor.requests.has(req.urlWithParams)) {
              LoadingInterceptor.requests.delete(req.urlWithParams);
            }
            LoadingInterceptor.requests.size === 0
              ? this.loadingService.hide()
              : null;
          };
        })(req),
      ),
    );
  }
}
