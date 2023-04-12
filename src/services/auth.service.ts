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

@Injectable({
  providedIn: 'root',
})
export class AuthService extends RegisterServiceMixin(class {}) {
  private readonly http = inject(HttpClient);
  private readonly urlService = inject(UrlService);
  private readonly employeeService = inject(EmployeeService);
  private readonly tokenService = inject(TokenService);
  private readonly menuItemService = inject(MenuItemService);
  private authenticated = false;

  @CastResponse()
  private _login(
    credentials: Partial<CredentialsContract>
  ): Observable<LoginDataContract> {
    return this.http.post<LoginDataContract>(
      this.urlService.URLS.AUTH,
      credentials
    );
  }

  login(
    credentials: Partial<CredentialsContract>
  ): Observable<LoginDataContract> {
    return this._login(credentials).pipe(this.setDateAfterAuthenticate());
  }

  validateToken(): Observable<boolean> {
    return of(false)
      .pipe(
        tap(
          () =>
            this.tokenService.getTokenFromStore() &&
            this.tokenService.setToken(this.tokenService.getTokenFromStore())
        )
      )
      .pipe(
        switchMap(() =>
          iif(
            () => this.tokenService.hasToken(),
            this.tokenService
              .validateToken()
              .pipe(this.setDateAfterAuthenticate()),
            of(false)
          )
        )
      )
      .pipe(map(() => true))
      .pipe(
        catchError(() => {
          return of(false);
        })
      );
  }

  logout(): void {
    this.authenticated = false;
  }

  private setDateAfterAuthenticate(): OperatorFunction<
    LoginDataContract,
    LoginDataContract
  > {
    return (source) => {
      return source.pipe(
        map((data) => this.employeeService.setLoginData(data)),
        tap((data) => this.tokenService.setToken(data.token)),
        tap(() => (this.authenticated = true)),
        tap(() => this.menuItemService.filterStaticMenu()),
        tap(() => this.menuItemService.buildHierarchy())
      );
    };
  }

  isAuthenticated(): boolean {
    return this.authenticated;
  }

  isGuest(): boolean {
    return !this.isAuthenticated();
  }
}
