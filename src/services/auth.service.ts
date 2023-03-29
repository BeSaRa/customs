import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UrlService } from '@services/url.service';
import { CredentialsContract } from '@contracts/credentials-contract';
import { Observable } from 'rxjs';
import { EmployeeService } from '@services/employee.service';
import { LoginDataContract } from '@contracts/login-data-contract';
import { CastResponse } from 'cast-response';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private urlService = inject(UrlService);
  private employeeService = inject(EmployeeService);

  @CastResponse(undefined)
  login(
    credentials: Partial<CredentialsContract>
  ): Observable<LoginDataContract> {
    return this.http.post<LoginDataContract>(
      this.urlService.URLS.AUTH,
      credentials
    );
  }

  logout(): void {
    console.log('logout');
  }
}
