import { Component, HostListener, inject } from '@angular/core';
import { DialogService } from '@services/dialog.service';
import { LangService } from '@services/lang.service';
import { LocalizationService } from '@services/localization.service';
import { AuthService } from '@services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  dialog = inject(DialogService);
  lang = inject(LangService);
  localizationService = inject(LocalizationService);
  authService = inject(AuthService);

  @HostListener('window:keydown.alt.control.a')
  openAddLanguage(): void {
    // TODO: should check if the user authenticated first before display for him the
    if (!this.authService.isAuthenticated()) {
      return;
    }
  }
  @HostListener('window:keydown.alt.control.l')
  toggleLanguage(): void {
    this.lang.toggleLang();
  }
}
