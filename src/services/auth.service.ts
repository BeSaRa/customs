import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UrlService } from '@services/url.service';
import { CredentialsContract } from '@contracts/credentials-contract';
import { map, Observable, tap } from 'rxjs';
import { EmployeeService } from '@services/employee.service';
import { LoginDataContract } from '@contracts/login-data-contract';
import { CastResponse } from 'cast-response';
import { BaseServiceMixin } from '@mixins/base-service-mixin';
import { TokenService } from '@services/token.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService extends BaseServiceMixin(class {}) {
  private readonly http = inject(HttpClient);
  private readonly urlService = inject(UrlService);
  private readonly employeeService = inject(EmployeeService);
  private readonly tokenService = inject(TokenService);

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
    return this._login(credentials).pipe(
      map((data) => this.employeeService.setLoginData(data)),
      tap((value) => this.tokenService.setToken(value.token))
    );
  }

  logout(): void {
    console.log('logout');
  }
}
