import { Component, inject } from '@angular/core';
import { LangService } from '@services/lang.service';
import { DialogService } from '@services/dialog.service';
import { filter } from 'rxjs';
import { UserClick } from '@enums/user-click';
import { ToastService } from '@services/toast.service';
import { AuthService } from '@services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { AppRoutes } from '@constants/app-routes';
import { IconButtonComponent } from '@standalone/components/icon-button/icon-button.component';
import { MatTooltip } from '@angular/material/tooltip';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-external-navbar',
  standalone: true,
  imports: [IconButtonComponent, RouterLink, MatTooltip, NgOptimizedImage],
  templateUrl: './external-navbar.component.html',
  styleUrls: ['./external-navbar.component.scss'],
})
export class ExternalNavbarComponent {
  lang = inject(LangService);
  dialog = inject(DialogService);
  authService = inject(AuthService);
  toast = inject(ToastService);
  router = inject(Router);

  logout() {
    this.dialog
      .confirm(this.lang.map.are_you_sure_you_want_to_logout, '', {
        yes: this.lang.map.yes,
        no: this.lang.map.no,
      })
      .afterClosed()
      .pipe(filter(value => value === UserClick.YES))
      .subscribe(() => {
        this.authService.logout();
        this.toast.success(this.lang.map.logged_out_successfully);
        this.router.navigate([AppRoutes.EXTERNAL_LOGIN]).then();
      });
  }
}