import {
  Component,
  EventEmitter,
  inject,
  OnInit,
  Output,
  signal,
} from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { InputComponent } from '@standalone/components/input/input.component';
import { EmployeeService } from '@services/employee.service';
import { MatMenuModule } from '@angular/material/menu';
import { AppIcons } from '@constants/app-icons';
import { LangService } from '@services/lang.service';
import { DialogService } from '@services/dialog.service';
import { exhaustMap, filter, map, Subject, switchMap, takeUntil } from 'rxjs';
import { UserClick } from '@enums/user-click';
import { ToastService } from '@services/toast.service';
import { AuthService } from '@services/auth.service';
import { Router } from '@angular/router';
import { AppRoutes } from '@constants/app-routes';
import { IconButtonComponent } from '@standalone/components/icon-button/icon-button.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { UserPreferencesService } from '@services/user-preferences.service';
import { UserPreferences } from '@models/user-preferences';
import { OnDestroyMixin } from '@mixins/on-destroy-mixin';
import { SelectInputComponent } from '../select-input/select-input.component';
import { TooltipListPipe } from '@standalone/pipes/tooltip-list.pipe';
import { OrganizationUnit } from '@models/organization-unit';
import { NavbarService } from '@services/navbar.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule,
    InputComponent,
    NgOptimizedImage,
    MatMenuModule,
    IconButtonComponent,
    MatTooltipModule,
    SelectInputComponent,
    TooltipListPipe,
  ],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent
  extends OnDestroyMixin(class {})
  implements OnInit
{
  @Output()
  menuClick = new EventEmitter<MouseEvent | undefined>();
  lang = inject(LangService);
  employeeService = inject(EmployeeService);
  employee = this.employeeService.getEmployee();
  dialog = inject(DialogService);
  toast = inject(ToastService);
  authService = inject(AuthService);
  router = inject(Router);
  userPreferencesService = inject(UserPreferencesService);
  editUserPreferences$: Subject<void> = new Subject<void>();

  switchOrganization$ = new Subject<OrganizationUnit>();
  navBarService = inject(NavbarService);
  selectedOrganization = signal(this.employeeService.getOrganizationUnit());

  ngOnInit(): void {
    this._listenToEditUserPreferences();
    this.listenToSwitchOrganization();
  }

  menuClicked($event?: MouseEvent) {
    this.menuClick.emit($event);
  }

  protected readonly AppIcons = AppIcons;

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
        this.router.navigate([AppRoutes.LOGIN]).then();
      });
  }

  /**
   * listen to edit event
   * @protected
   */
  protected _listenToEditUserPreferences() {
    this.editUserPreferences$
      .pipe(takeUntil(this.destroy$))
      .pipe(
        map(() =>
          new UserPreferences().clone<UserPreferences>(
            this.employee?.userPreferences,
          ),
        ),
      )
      .pipe(
        switchMap(model => {
          return this.userPreferencesService
            .openEditDialog(model as UserPreferences, {
              //extras
              arName: this.employee?.arName,
              enName: this.employee?.enName,
              empNum: this.employee?.empNum,
              qid: this.employee?.qid,
              phoneNumber: this.employee?.phoneNumber,
              email: this.employee?.email,
            })
            .afterClosed()
            .pipe(
              filter((model): model is UserPreferences => {
                return this.userPreferencesService.isInstanceOf(model);
              }),
            );
        }),
      )
      .subscribe(() => {
        //this.reload$.next();
      });
  }

  switchLang() {
    this.lang.toggleLang();
  }

  private listenToSwitchOrganization() {
    this.switchOrganization$
      .pipe(
        exhaustMap(org => {
          return this.authService
            .switchOrganization(org.id)
            .pipe(map(() => org));
        }),
      )
      .subscribe(dep => {
        this.toast.success(this.lang.map.organization_switched_successfully);
        this.selectedOrganization.set(dep);
        this.navBarService.departmentChange$.next();
      });
  }
}
