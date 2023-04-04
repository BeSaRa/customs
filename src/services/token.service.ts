import { inject, Injectable } from '@angular/core';
import { RegisterServiceMixin } from '@mixins/register-service-mixin';
import { ECookieService } from '@services/e-cookie.service';
import { ConfigService } from '@services/config.service';
import { HttpClient } from '@angular/common/http';
import { UrlService } from '@services/url.service';
import { Observable } from 'rxjs';
import { LoginDataContract } from '@contracts/login-data-contract';
import { CastResponse } from 'cast-response';

@Injectable({
  providedIn: 'root',
})
export class TokenService extends RegisterServiceMixin(class {}) {
  private readonly eCookieService = inject(ECookieService);
  private readonly tokenStoreKey = inject(ConfigService).CONFIG.TOKEN_STORE_KEY;
  private readonly http = inject(HttpClient);
  private readonly urlService = inject(UrlService);
  private token?: string;

  setToken(token: string | undefined): void {
    this.token = token;
    this.token && this.eCookieService.putE(this.tokenStoreKey, this.token);
  }

  getToken(): string | undefined {
    return this.token;
  }

  hasStoredToken(): boolean {
    return !!this.getTokenFromStore()?.length;
  }

  getTokenFromStore(): string | undefined {
    return this.eCookieService.getE(this.tokenStoreKey);
  }

  hasToken(): boolean {
    return !!this.getToken()?.length;
  }

  isSameToken(token: string | undefined): token is string {
    return this.token === token;
  }

  clearToken(): void {
    this.token = undefined;
    this.eCookieService.removeE(this.tokenStoreKey);
  }

  @CastResponse()
  private _validateToken(): Observable<LoginDataContract> {
    return this.http.post<LoginDataContract>(
      this.urlService.URLS.VALIDATE_TOKEN,
      {}
    );
  }

  validateToken(): Observable<LoginDataContract> {
    return this._validateToken();
  }
}
