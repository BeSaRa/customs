import { Component } from '@angular/core';
import { LangService } from '@services/lang.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  constructor(public lang: LangService) {}

  toggleLanguage() {
    this.lang.toggleLang();
  }

  log($event: { name: string; width: number }, size: string): void {
    console.log($event, size);
  }
}
