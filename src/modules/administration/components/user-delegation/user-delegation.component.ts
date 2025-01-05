import { AdminComponent } from '@abstracts/admin-component';
import { Component, inject, input } from '@angular/core';
import { AppIcons } from '@constants/app-icons';
import { ContextMenuActionContract } from '@contracts/context-menu-action-contract';
import { UserDelegationType } from '@enums/user-delegation-type';
import { ColumnsWrapper } from '@models/columns-wrapper';
import { NoneFilterColumn } from '@models/none-filter-column';
import { TextFilterColumn } from '@models/text-filter-column';
import { UserDelegation } from '@models/user-delegation';
import { UserDelegationPopupComponent } from '@modules/administration/popups/user-delegation-popup/user-delegation-popup.component';
import { ConfigService } from '@services/config.service';
import { StatusTypes } from '@enums/status-types';
import { UserDelegationService } from '@services/user-delegation.service';
import { BehaviorSubject, Subject, switchMap } from 'rxjs';
import { ViewAttachmentPopupComponent } from '@standalone/popups/view-attachment-popup/view-attachment-popup.component';
import { SelectFilterColumn } from '@models/select-filter-column';
import { OrganizationUnitService } from '@services/organization-unit.service';
import { InternalUserService } from '@services/internal-user.service';

@Component({
  selector: 'app-user-delegation',
  templateUrl: './user-delegation.component.html',
  styleUrls: ['./user-delegation.component.scss'],
})
export class UserDelegationComponent extends AdminComponent<
  UserDelegationPopupComponent,
  UserDelegation,
  UserDelegationService
> {
  type = input<UserDelegationType>();
  config = inject(ConfigService);
  service = inject(UserDelegationService);
  internalEmployees = inject(InternalUserService).loadAsLookups();
  actions: ContextMenuActionContract<UserDelegation>[] = [
    {
      name: 'view',
      type: 'action',
      label: 'view',
      icon: AppIcons.VIEW,
      callback: item => {
        this.view$.next(item);
      },
    },
  ];
  // here we have a new implementation for displayed/filter Columns for the table
  columnsWrapper: ColumnsWrapper<UserDelegation> = new ColumnsWrapper(
    new NoneFilterColumn('select'),
    new SelectFilterColumn(
      'delegatorId',
      this.internalEmployees,
      'id',
      'getNames',
    ),
    new SelectFilterColumn(
      'delegateeId',
      this.internalEmployees,
      'id',
      'getNames',
    ),
    new SelectFilterColumn(
      'departmentId',
      inject(OrganizationUnitService).loadAsLookups(),
      'id',
      'getNames',
    ),
    new NoneFilterColumn('startDate'),
    new NoneFilterColumn('endDate'),
    new SelectFilterColumn(
      'status',
      this.lookupService.lookups.commonStatus,
      'lookupKey',
      'getNames',
    ),
    new NoneFilterColumn('actions'),
  ).attacheFilter(this.filter$);
  viewDecisionFile$ = new Subject<string>();

  override ngOnInit(): void {
    super.ngOnInit();
    this.filter$ = new BehaviorSubject<Partial<UserDelegation>>({
      delegationType: this.type() ?? UserDelegationType.ADMIN,
    });
    this.listenToViewDecisionFile();
    this.filter$.next({ status: StatusTypes.ACTIVE });
  }

  isDelegator(element: UserDelegation) {
    return this.employeeService.getEmployee()?.id === element.delegatorId;
  }

  override _getCreateExtras() {
    return { type: this.type() ?? UserDelegationType.ADMIN };
  }

  override _getEditExtras() {
    return { type: this.type() ?? UserDelegationType.ADMIN };
  }

  isDelegateeOnPreferences(element: UserDelegation) {
    return (
      this.isFromUserPreferences() &&
      element.delegateeId === this.employeeService.getEmployee()!.id
    );
  }
  isFromUserPreferences() {
    return this.type() === UserDelegationType.PREFERENCES;
  }
  private listenToViewDecisionFile() {
    this.viewDecisionFile$
      .pipe(
        switchMap(delegationVsId => {
          return this.service.getFileAttachments(delegationVsId);
        }),
      )
      .pipe(
        switchMap(model => {
          return this.dialog
            .open(ViewAttachmentPopupComponent, {
              data: {
                model,
              },
            })
            .afterClosed();
        }),
      )
      .subscribe();
  }

  protected readonly StatusTypes = StatusTypes;
}
