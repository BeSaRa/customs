import { AdminComponent } from '@abstracts/admin-component';
import { Component, inject, input } from '@angular/core';
import { AppIcons } from '@constants/app-icons';
import { ContextMenuActionContract } from '@contracts/context-menu-action-contract';
import { UserDelegationType } from '@enums/user-delegation-type';
import { ColumnsWrapper } from '@models/columns-wrapper';
import { NoneFilterColumn } from '@models/none-filter-column';
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
import { InvestigationService } from '@services/investigation.service';

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
  investigationService = inject(InvestigationService);
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
      this.lookupService.lookups.DelegationStatus,
      'lookupKey',
      'getNames',
    ),
    new NoneFilterColumn('actions'),
  ).attacheFilter(this.filter$);
  viewDelegationFile$ = new Subject<string>();

  override ngOnInit(): void {
    super.ngOnInit();
    this.filter$ = new BehaviorSubject<Partial<UserDelegation>>({
      delegationType: this.type() ?? UserDelegationType.ADMIN,
      status:
        this.type() !== UserDelegationType.PREFERENCES
          ? StatusTypes.ACTIVE
          : undefined,
    });
    this.listenToViewDelegationFile();
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
  isActive(element: UserDelegation) {
    return element.status === StatusTypes.ACTIVE;
  }
  private listenToViewDelegationFile() {
    this.viewDelegationFile$
      .pipe(
        switchMap(delegationVsId => {
          return this.investigationService.getDecisionFileAttachments(
            delegationVsId,
          );
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
