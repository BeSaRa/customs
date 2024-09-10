import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UrlService } from '@services/url.service';
import { CredentialsContract } from '@contracts/credentials-contract';
import {
  catchError,
  iif,
  map,
  Observable,
  of,
  OperatorFunction,
  switchMap,
  tap,
} from 'rxjs';
import { EmployeeService } from '@services/employee.service';
import { LoginDataContract } from '@contracts/login-data-contract';
import { CastResponse } from 'cast-response';
import { RegisterServiceMixin } from '@mixins/register-service-mixin';
import { TokenService } from '@services/token.service';
import { MenuItemService } from '@services/menu-item.service';
import { ServiceContract } from '@contracts/service-contract';
import { LangService } from '@services/lang.service';
import { ExternalCredentialsContract } from '@contracts/external-credentials-contract';
import { VerifyExternalCredentialsContract } from '@contracts/verify-external-credentials-contract';
import { UserTypes } from '@enums/user-types';
import { ignoreErrors } from '@utils/utils';
import { ExternalLoginDataContract } from '@contracts/external-login-data-contract';
import { CommonService } from '@services/common.service';
import { ECookieService } from '@services/e-cookie.service';
import { ConfigService } from '@services/config.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService
  extends RegisterServiceMixin(class {})
  implements ServiceContract
{
  serviceName = 'AuthService';
  private readonly http = inject(HttpClient);
  private readonly urlService = inject(UrlService);
  private readonly employeeService = inject(EmployeeService);
  private readonly tokenService = inject(TokenService);
  private readonly menuItemService = inject(MenuItemService);
  private readonly langService = inject(LangService);
  private readonly commonService = inject(CommonService);
  private readonly eCookieService = inject(ECookieService);
  private readonly configurationService = inject(ConfigService);

  private authenticated = false;

  @CastResponse()
  private _login(
    credentials: Partial<CredentialsContract>,
  ): Observable<LoginDataContract> {
    return this.http.post<LoginDataContract>(
      this.urlService.URLS.AUTH,
      credentials,
    );
  }

  @CastResponse(undefined, { unwrap: 'rs' })
  private _externalLogin(
    credentials: Partial<ExternalCredentialsContract>,
  ): Observable<ExternalLoginDataContract> {
    if (credentials.userType !== UserTypes.EXTERNAL_CLEARING_AGENCY) {
      return this.http.post<ExternalLoginDataContract>(
        this.urlService.URLS.AUTH_EXTERNAL,
        {
          qid: credentials.qid,
        },
      );
    } else {
      return this.http.post<ExternalLoginDataContract>(
        this.urlService.URLS.AUTH_CLEARING_AGENCY,
        {
          eId: credentials.eId,
        },
      );
    }
  }

  @CastResponse()
  private _verifyExternalLogin(
    credentials: Partial<VerifyExternalCredentialsContract>,
  ): Observable<LoginDataContract> {
    return this.http
      .post<LoginDataContract>(this.urlService.URLS.AUTH_VERIFY, credentials)
      .pipe(ignoreErrors());
  }

  @CastResponse()
  private _verifyExternalAgencyLogin(
    credentials: Partial<VerifyExternalCredentialsContract>,
  ): Observable<LoginDataContract> {
    return this.http
      .post<LoginDataContract>(
        this.urlService.URLS.AUTH_CLEARING_AGENCY_VERIFY,
        credentials,
      )
      .pipe(ignoreErrors());
  }

  login(
    credentials: Partial<CredentialsContract>,
  ): Observable<LoginDataContract> {
    return this._login(credentials).pipe(this.setDateAfterAuthenticate());
  }

  externalLogin(
    credentials: Partial<ExternalCredentialsContract>,
  ): Observable<ExternalLoginDataContract> {
    return this._externalLogin(credentials);
  }

  verifyExternalLogin(credentials: Partial<VerifyExternalCredentialsContract>) {
    if (credentials.userType === UserTypes.EXTERNAL_CLEARING_AGENCY) {
      delete credentials.userType;
      delete credentials.qid;
      return this._verifyExternalAgencyLogin(credentials).pipe(
        this.setDateAfterAuthenticate(),
      );
    } else {
      delete credentials.userType;
      delete credentials.eId;
      return this._verifyExternalLogin(credentials).pipe(
        this.setDateAfterAuthenticate(),
      );
    }
  }

  getTokenFromStore(): string | undefined {
    return this.eCookieService.getE(
      this.configurationService.CONFIG.TOKEN_STORE_KEY,
    );
  }

  validateToken(): Observable<boolean> {
    return of(false)
      .pipe(
        tap(
          () =>
            this.tokenService.getTokenFromStore() &&
            this.tokenService.setToken(this.tokenService.getTokenFromStore()),
        ),
      )
      .pipe(
        switchMap(() =>
          iif(
            () => this.tokenService.hasToken(),
            this.tokenService
              .validateToken()
              .pipe(this.setDateAfterAuthenticate()),
            of(false),
          ),
        ),
      )
      .pipe(
        switchMap(() =>
          !this.getTokenFromStore()
            ? of(null)
            : this.commonService.loadCounters(),
        ),
      )
      .pipe(map(() => true))
      .pipe(
        catchError(() => {
          return of(false);
        }),
      );
  }

  logout(): void {
    this.authenticated = false;
    this.tokenService.clearToken();
    this.employeeService.clearEmployee();
  }

  private setDateAfterAuthenticate(): OperatorFunction<
    LoginDataContract,
    LoginDataContract
  > {
    return source => {
      return source.pipe(
        map(data => this.employeeService.setLoginData(data)),
        tap(data => this.tokenService.setToken(data.token)),
        tap(
          data =>
            data.internalUser &&
            this.langService.setDefaultLang(
              data.internalUser.userPreferences.defaultLang.toString(),
            ),
        ),
        tap(() => {
          this.authenticated = true;
        }),
        tap(data => {
          console.log(data.menuItems);
          this.menuItemService.filterStaticMenu(data.menuItems || []);
        }),
        tap(() => this.menuItemService.buildHierarchy()),
      );
    };
  }

  isAuthenticated(): boolean {
    return this.authenticated;
  }

  isGuest(): boolean {
    return !this.isAuthenticated();
  }

  @CastResponse()
  private _switchOrganization(
    organizationId: number,
  ): Observable<LoginDataContract> {
    return this.http.post<LoginDataContract>(
      this.urlService.URLS.SWITCH_ORGANIZATION + '/' + organizationId,
      {},
    );
  }

  switchOrganization(organizationId: number): Observable<LoginDataContract> {
    return this._switchOrganization(organizationId).pipe(
      this.setDateAfterAuthenticate(),
    );
  }
}
