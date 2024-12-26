import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { IS_REFRESH } from '@http-contexts/tokens';
import { ConfigService } from '@services/config.service';
import { TokenService } from '@services/token.service';
import { Observable } from 'rxjs';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  tokenService = inject(TokenService);
  configService = inject(ConfigService);

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler,
  ): Observable<HttpEvent<unknown>> {
    const _isRefresh = request.context.get(IS_REFRESH);
    const token = _isRefresh
      ? this.tokenService.getRefreshToken()
      : this.tokenService.getToken();
    if (
      this.tokenService.hasToken(_isRefresh) &&
      this.tokenService.isSameToken(token, _isRefresh)
    ) {
      request = request.clone({
        setHeaders: {
          [this.configService.CONFIG.TOKEN_HEADER_KEY]: token,
        },
      });
    }
    return next.handle(request);
  }
}
