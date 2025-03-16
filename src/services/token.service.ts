import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ServiceContract } from '@contracts/service-contract';
import { RegisterServiceMixin } from '@mixins/register-service-mixin';
import { ConfigService } from '@services/config.service';
import { ECookieService } from '@services/e-cookie.service';
import { UrlService } from '@services/url.service';

@Injectable({
  providedIn: 'root',
})
export class TokenService
  extends RegisterServiceMixin(class {})
  implements ServiceContract
{
  serviceName = 'TokenService';
  private readonly eCookieService = inject(ECookieService);
  private readonly config = inject(ConfigService);
  private readonly tokenStoreKey = this.config.CONFIG.TOKEN_STORE_KEY;
  private readonly reportTokenStoreKey =
    this.config.CONFIG.REPORT_TOKEN_STORE_KEY;
  private readonly refreshTokenStoreKey =
    this.config.CONFIG.REFRESH_TOKEN_STORE_KEY;
  private readonly http = inject(HttpClient);
  private readonly urlService = inject(UrlService);
  private token?: string;
  private reportToken?: string;
  private refreshToken?: string;

  setToken(token: string | undefined): void {
    this.token = token;
    this.token && this.eCookieService.putE(this.tokenStoreKey, this.token);
  }
  setReportToken(reportToken: string | undefined): void {
    this.reportToken = reportToken;
    this.reportToken &&
      this.eCookieService.putE(this.reportTokenStoreKey, this.reportToken);
  }

  setRefreshToken(token: string | undefined): void {
    this.refreshToken = token;
    this.refreshToken &&
      this.eCookieService.putE(this.refreshTokenStoreKey, this.refreshToken);
  }

  getToken(): string | undefined {
    return this.token;
  }
  getReportToken(): string | undefined {
    return this.reportToken;
  }

  getRefreshToken(): string | undefined {
    return this.refreshToken;
  }

  hasStoredToken(): boolean {
    return !!this.getTokenFromStore()?.length;
  }

  getTokenFromStore(isRefresh = false): string | undefined {
    return this.eCookieService.getE(
      isRefresh ? this.refreshTokenStoreKey : this.tokenStoreKey,
    );
  }

  hasToken(isRefresh = false): boolean {
    return isRefresh
      ? !!this.getRefreshToken()?.length
      : !!this.getToken()?.length;
  }

  isSameToken(token: string | undefined, isRefresh = false): token is string {
    return isRefresh ? this.refreshToken === token : this.token === token;
  }

  clearToken(): void {
    this.token = undefined;
    this.refreshToken = undefined;
    this.reportToken = undefined;
    this.eCookieService.removeE(this.tokenStoreKey);
    this.eCookieService.removeE(this.refreshTokenStoreKey);
    this.eCookieService.removeE(this.reportTokenStoreKey);
  }
}
