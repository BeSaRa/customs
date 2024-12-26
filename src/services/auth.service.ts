import { HttpClient, HttpContext } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AppRoutes } from '@constants/app-routes';
import { CredentialsContract } from '@contracts/credentials-contract';
import { ExternalCredentialsContract } from '@contracts/external-credentials-contract';
import { ExternalLoginDataContract } from '@contracts/external-login-data-contract';
import { LoginDataContract } from '@contracts/login-data-contract';
import { ServiceContract } from '@contracts/service-contract';
import { VerifyExternalCredentialsContract } from '@contracts/verify-external-credentials-contract';
import { UserTypes } from '@enums/user-types';
import {
  IS_REFRESH,
  NO_ERROR_HANDLE,
  NO_LOADER_TOKEN,
} from '@http-contexts/tokens';
import { RegisterServiceMixin } from '@mixins/register-service-mixin';
import { CommonService } from '@services/common.service';
import { EmployeeService } from '@services/employee.service';
import { LangService } from '@services/lang.service';
import { MenuItemService } from '@services/menu-item.service';
import { TokenService } from '@services/token.service';
import { UrlService } from '@services/url.service';
import { ignoreErrors } from '@utils/utils';
import { CastResponse } from 'cast-response';
import {
  catchError,
  iif,
  interval,
  map,
  Observable,
  of,
  OperatorFunction,
  Subscription,
  switchMap,
  tap,
} from 'rxjs';
import { ConfigService } from './config.service';

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
  private readonly configService = inject(ConfigService);
  private readonly router = inject(Router);

  private authenticated = false;

  private _refreshSubscription?: Subscription;

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
    return this._login(credentials).pipe(this.setDataAfterAuthenticate());
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
        this.setDataAfterAuthenticate(),
      );
    } else {
      delete credentials.userType;
      delete credentials.eId;
      return this._verifyExternalLogin(credentials).pipe(
        this.setDataAfterAuthenticate(),
      );
    }
  }

  private _listenToRefresh() {
    if (this._refreshSubscription) this._refreshSubscription.unsubscribe();

    this._refreshSubscription = interval(
      Math.floor(
        (this.employeeService.getLoginData()?.accessTimeOut ??
          this.configService.CONFIG.ACCESS_TOKEN_TIMEOUT_IN_MINUTES) *
          0.95 *
          60 *
          1000,
      ),
    )
      .pipe(switchMap(() => this.refreshToken()))
      .subscribe(() => {});
  }

  refreshToken(): Observable<boolean> {
    return of(false)
      .pipe(
        tap(() =>
          this.tokenService.setRefreshToken(
            this.tokenService.getTokenFromStore(true),
          ),
        ),
      )
      .pipe(
        switchMap(() =>
          iif(
            () => this.tokenService.hasToken(true),
            this._refreshToken().pipe(this.setDataAfterAuthenticate()),
            of(false),
          ),
        ),
      )
      .pipe(
        switchMap(() =>
          !this.tokenService.getTokenFromStore()
            ? of(null)
            : this.commonService.loadCounters(),
        ),
      )
      .pipe(map(() => true))
      .pipe(
        catchError(() => {
          this.logout();
          this.router.navigate([AppRoutes.LOGIN]);
          return of(false);
        }),
      );
  }

  @CastResponse()
  private _refreshToken(): Observable<LoginDataContract> {
    return this.http.post<LoginDataContract>(
      this.urlService.URLS.REFRESH_TOKEN,
      {},
      {
        context: new HttpContext()
          .set(NO_LOADER_TOKEN, true)
          .set(NO_ERROR_HANDLE, true)
          .set(IS_REFRESH, true),
      },
    );
  }

  logout(): void {
    this.authenticated = false;
    this.tokenService.clearToken();
    this.employeeService.clearEmployee();
    this._refreshSubscription?.unsubscribe();
  }

  private setDataAfterAuthenticate(
    listenToRefresh = true,
  ): OperatorFunction<LoginDataContract, LoginDataContract> {
    return source => {
      return source.pipe(
        map(data => this.employeeService.setLoginData(data)),
        tap(data => this.tokenService.setToken(data.accessToken)),
        tap(data => this.tokenService.setRefreshToken(data.refreshToken)),
        tap(() => listenToRefresh && this._listenToRefresh()),
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
      this.setDataAfterAuthenticate(false),
    );
  }
}
