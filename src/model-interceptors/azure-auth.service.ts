import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { UrlService } from '@services/url.service';

@Injectable()
export class AzureAuthInterceptor implements HttpInterceptor {
  private readonly FUNCTIONS_KEY =
    'eW3JzV4TJRYiJTkxhcKKO6hySeq9t9KKxjp8eJUHz4F6AzFuxVxblQ==';

  constructor(private urlService: UrlService) {}

  intercept(
    req: HttpRequest<unknown>,
    next: HttpHandler,
  ): Observable<HttpEvent<unknown>> {
    const azureBaseUrls = Object.values(this.urlService.AZURE_URLS);

    const isAzureRequest = azureBaseUrls.some(baseUrl =>
      req.url.startsWith(baseUrl),
    );

    if (isAzureRequest) {
      const modifiedReq = req.clone({
        setHeaders: {
          'x-functions-key': this.FUNCTIONS_KEY,
        },
      });
      return next.handle(modifiedReq);
    }

    return next.handle(req);
  }
}
