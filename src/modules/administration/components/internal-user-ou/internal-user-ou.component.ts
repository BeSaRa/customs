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
import { map } from 'rxjs';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { InternalUserService } from '@services/internal-user.service';

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
  organizationUnits: number[] = [];
  defaultOUId!: number;
  override ngOnInit(): void {
    super.ngOnInit();
    this.data$
      .pipe(
        map((internalUsers) =>
          internalUsers.map(
            (internalUserOu) => internalUserOu.organizationUnitId
          )
        )
      )
      .subscribe(
        (organizationUnitIds) => (this.organizationUnits = organizationUnitIds)
      );
    this.filter$.next({ internalUserId: this.internalUser.id });
    this.defaultOUId = this.internalUser.defaultOUId;
  }
  service = inject(InternalUserOUService);
  internalUserService = inject(InternalUserService);
  actions: ContextMenuActionContract<InternalUserOU>[] = [
    {
      name: 'delete',
      type: 'action',
      label: 'delete',
      icon: AppIcons.DELETE,
      callback: (item) => {
        this.delete$.next(item);
      },
    },
  ];
  // here we have a new implementation for displayed/filter Columns for the table
  columnsWrapper: ColumnsWrapper<InternalUserOU> = new ColumnsWrapper(
    new TextFilterColumn('organizationUnitId'),
    new NoneFilterColumn('default'),
    new NoneFilterColumn('actions')
  ).attacheFilter(this.filter$);

  override _getCreateExtras(): unknown {
    return {
      internalUserId: this.internalUser.id,
      organizationUnits: this.organizationUnits,
    };
  }

  changeDefaultDepartment(
    element: InternalUserOU,
    slideToggle?: MatSlideToggle
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
}
