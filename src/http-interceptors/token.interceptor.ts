import { inject, Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { TokenService } from '@services/token.service';
import { ConfigService } from '@services/config.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  tokenService = inject(TokenService);
  configService = inject(ConfigService);

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    const token = this.tokenService.getToken();
    if (this.tokenService.hasToken() && this.tokenService.isSameToken(token)) {
      request = request.clone({
        setHeaders: {
          [this.configService.CONFIG.TOKEN_HEADER_KEY]: token,
        },
      });
    }
    return next.handle(request);
  }
}
