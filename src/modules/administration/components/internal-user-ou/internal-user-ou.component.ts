import { Component, inject, Input, OnInit } from '@angular/core';
import { AdminComponent } from '@abstracts/admin-component';
import { InternalUserOU } from '@models/internal-user-ou';
import { InternalUserOUService } from '@services/internal-user-ou.service';
import { InternalUserOUPopupComponent } from '@modules/administration/popups/internal-user-ou-popup/internal-user-ou-popup.component';
import { ContextMenuActionContract } from '@contracts/context-menu-action-contract';
import { AppIcons } from '@constants/app-icons';
import { ColumnsWrapper } from '@models/columns-wrapper';
import { TextFilterColumn } from '@models/text-filter-column';
import { NoneFilterColumn } from '@models/none-filter-column';
import { InternalUser } from '@models/internal-user';
import { map, Subject } from 'rxjs';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { InternalUserService } from '@services/internal-user.service';
import { InternalUserPermissionsPopupComponent } from '@modules/administration/popups/internal-user-permissions-popup/internal-user-permissions-popup.component';
import { InternalUserTeamsPopupComponent } from '@modules/administration/popups/internal-user-teams-popup/internal-user-teams-popup.component';

@Component({
  selector: 'app-internal-user-ou',
  templateUrl: './internal-user-ou.component.html',
  styleUrls: ['./internal-user-ou.component.scss'],
})
export class InternalUserOUComponent
  extends AdminComponent<
    InternalUserOUPopupComponent,
    InternalUserOU,
    InternalUserOUService
  >
  implements OnInit
{
  @Input({ required: true }) internalUser!: InternalUser;
  @Input({ required: true }) inViewMode!: boolean;
  organizationUnits: number[] = [];
  defaultOUId!: number;
  editUserPermissions$: Subject<InternalUserOU> = new Subject<InternalUserOU>();
  editUserTeams$: Subject<InternalUserOU> = new Subject<InternalUserOU>();

  override ngOnInit(): void {
    super.ngOnInit();
    this.setUserOus();
    this.defaultOUId = this.internalUser.defaultOUId;
    this.listenToEditUserPermissions();
    this.listenToEditUserTeams();
  }
  service = inject(InternalUserOUService);
  internalUserService = inject(InternalUserService);
  actions: ContextMenuActionContract<InternalUserOU>[] = [
    {
      name: 'delete',
      type: 'action',
      label: 'delete',
      disabled: this.inViewMode,
      icon: AppIcons.DELETE,
      callback: item => {
        this.delete$.next(item);
      },
    },
    {
      name: 'permissions',
      type: 'action',
      label: 'lbl_permissions',
      icon: AppIcons.PERMISSIONS_LIST,
      callback: item => {
        this.editUserPermissions$.next(item);
      },
    },
    {
      name: 'teams',
      type: 'action',
      label: 'menu_user_team',
      icon: AppIcons.TEAM_INBOX,
      callback: item => {
        this.editUserTeams$.next(item);
      },
    },
  ];
  columnsWrapper: ColumnsWrapper<InternalUserOU> = new ColumnsWrapper(
    new TextFilterColumn('organizationUnitId'),
    new NoneFilterColumn('default'),
    new NoneFilterColumn('actions'),
  );

  override _getCreateExtras(): unknown {
    return {
      internalUserId: this.internalUser.id,
      organizationUnits: this.organizationUnits,
    };
  }

  setUserOus() {
    this.data$
      .pipe(
        map(internalUsers =>
          internalUsers.map(
            internalUserOu => internalUserOu.organizationUnitId,
          ),
        ),
      )
      .subscribe(
        organizationUnitIds => (this.organizationUnits = organizationUnitIds),
      );
    this.filter$.next({ internalUserId: this.internalUser.id });
  }

  changeDefaultDepartment(
    element: InternalUserOU,
    slideToggle?: MatSlideToggle,
  ) {
    if (this.isDefaultDepartment(element)) {
      slideToggle && (slideToggle.checked = true);
      return;
    }
    this.internalUserService
      .updateDefaultDepartment(this.internalUser.id, element.organizationUnitId)
      .subscribe(() => {
        this.defaultOUId = element.organizationUnitId;
        this.internalUser.defaultOUId = element.organizationUnitId;
        this.reload$.next();
      });
  }

  isDefaultDepartment(element: InternalUserOU): boolean {
    return element.organizationUnitId === this.defaultOUId;
  }

  listenToEditUserPermissions() {
    this.editUserPermissions$.subscribe(item => {
      this.dialog
        .open(InternalUserPermissionsPopupComponent, {
          data: {
            model: item,
            extras: {
              inViewMode: this.inViewMode,
            },
          },
        })
        .afterClosed()
        .subscribe(() => {
          this.reload$.next();
          this.setUserOus();
        });
    });
  }
  listenToEditUserTeams() {
    this.editUserTeams$.subscribe(item => {
      this.dialog
        .open(InternalUserTeamsPopupComponent, {
          data: {
            model: item,
            extras: {
              inViewMode: this.inViewMode,
            },
          },
        })
        .afterClosed()
        .subscribe(() => {
          this.reload$.next();
          this.setUserOus();
        });
    });
  }
}
