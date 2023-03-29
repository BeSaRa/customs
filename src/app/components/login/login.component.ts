import { Component, inject } from '@angular/core';
import { LangService } from '@services/lang.service';
import { AuthService } from '@services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  authService = inject(AuthService);
  lang = inject(LangService);

  toggleLanguage() {
    this.lang.toggleLang();
  }

  login(): void {
    console.log(this.authService, this.lang);
  }
}
