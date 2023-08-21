import { Component, HostListener, inject } from '@angular/core';
import { DialogService } from '@services/dialog.service';
import { LangService } from '@services/lang.service';
import { AuthService } from '@services/auth.service';
import { LocalizationService } from '@services/localization.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  dialog = inject(DialogService);
  lang = inject(LangService);
  authService = inject(AuthService);
  localizationService = inject(LocalizationService);

  get spinnerPosition(): 'right' | 'left' {
    return this.lang.getCurrent().direction === 'rtl' ? 'left' : 'right';
  }

  get progressDirection(): 'rtl+' | 'ltr+' {
    return this.lang.getCurrent().direction === 'rtl' ? 'rtl+' : 'ltr+';
  }
  @HostListener('window:keydown.alt.control.ش') // in case if developer hit the shortcut but with arabic language
  @HostListener('window:keydown.alt.control.a')
  openAddLanguage(): void {
    // TODO: should check if the user authenticated first before display for him the
    if (!this.authService.isAuthenticated()) {
      return;
    }
    this.localizationService.openCreateDialog();
  }

  @HostListener('window:keydown.alt.control.l')
  toggleLanguage(): void {
    this.lang.toggleLang();
  }
}
