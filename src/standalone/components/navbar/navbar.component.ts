import { Component, EventEmitter, inject, Output } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { InputComponent } from '@standalone/components/input/input.component';
import { EmployeeService } from '@services/employee.service';
import { MatMenuModule } from '@angular/material/menu';
import { AppIcons } from '@constants/app-icons';
import { LangService } from '@services/lang.service';
import { DialogService } from '@services/dialog.service';
import { filter } from 'rxjs';
import { UserClick } from '@enums/user-click';
import { ToastService } from '@services/toast.service';
import { AuthService } from '@services/auth.service';
import { Router } from '@angular/router';
import { AppRoutes } from '@constants/app-routes';
import { IconButtonComponent } from '@standalone/components/icon-button/icon-button.component';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    InputComponent,
    NgOptimizedImage,
    MatMenuModule,
    IconButtonComponent,
    MatTooltipModule,
  ],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent {
  @Output()
  menuClick = new EventEmitter<MouseEvent | undefined>();
  lang = inject(LangService);
  employee = inject(EmployeeService).getEmployee();
  dialog = inject(DialogService);
  toast = inject(ToastService);
  authService = inject(AuthService);
  router = inject(Router);

  menuClicked($event?: MouseEvent) {
    this.menuClick.emit($event);
  }

  protected readonly AppIcons = AppIcons;

  logout() {
    this.dialog
      .confirm(this.lang.map.are_you_sure_you_want_to_logout)
      .afterClosed()
      .pipe(filter((value) => value === UserClick.YES))
      .subscribe(() => {
        this.authService.logout();
        this.toast.success(this.lang.map.logged_out_successfully);
        this.router.navigate([AppRoutes.LOGIN]).then();
      });
  }
}
