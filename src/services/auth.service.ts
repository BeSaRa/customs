import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UrlService } from '@services/url.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private urlService = inject(UrlService);

  login(): void {
    console.log('login');
  }

  logout(): void {
    console.log('logout');
  }
}
