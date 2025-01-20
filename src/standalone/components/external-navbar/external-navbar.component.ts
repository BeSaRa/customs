import { NgClass, NgOptimizedImage } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { MatTooltip } from '@angular/material/tooltip';
import { Router, RouterLink } from '@angular/router';
import { AppIcons } from '@constants/app-icons';
import { UserClick } from '@enums/user-click';
import { UserTypes } from '@enums/user-types';
import { AuthService } from '@services/auth.service';
import { DialogService } from '@services/dialog.service';
import { EmployeeService } from '@services/employee.service';
import { LangService } from '@services/lang.service';
import { ToastService } from '@services/toast.service';
import { ButtonComponent } from '@standalone/components/button/button.component';
import { IconButtonComponent } from '@standalone/components/icon-button/icon-button.component';
import { filter } from 'rxjs';

@Component({
  selector: 'app-external-navbar',
  standalone: true,
  imports: [
    IconButtonComponent,
    RouterLink,
    MatTooltip,
    NgOptimizedImage,
    NgClass,
    MatIcon,
    MatMenu,
    MatMenuTrigger,
    MatMenuItem,
    MatButton,
    ButtonComponent,
  ],
  templateUrl: './external-navbar.component.html',
  styleUrls: ['./external-navbar.component.scss'],
})
export class ExternalNavbarComponent {
  lang = inject(LangService);
  dialog = inject(DialogService);
  authService = inject(AuthService);
  toast = inject(ToastService);
  router = inject(Router);
  employeeService = inject(EmployeeService);
  user = this.employeeService.getLoginData();
  person = this.employeeService.getExternalPerson();
  agency = this.employeeService.getExternalClearingAgency();

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
      });
  }

  isActive(url: string) {
    return this.router.url === url;
  }

  protected readonly AppIcons = AppIcons;
  protected readonly UserTypes = UserTypes;

  switchLang() {
    this.lang.toggleLang();
  }
}
