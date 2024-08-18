import { AdminComponent } from '@abstracts/admin-component';
import { Component, inject, OnInit } from '@angular/core';
import { AppIcons } from '@constants/app-icons';
import { ContextMenuActionContract } from '@contracts/context-menu-action-contract';
import { IntegrationsCases } from '@enums/integrations-cases';
import { StatusTypes } from '@enums/status-types';
import { ColumnsWrapper } from '@models/columns-wrapper';
import { Lookup } from '@models/lookup';
import { MawaredEmployee } from '@models/mawared-employee';
import { NoneFilterColumn } from '@models/none-filter-column';
import { SelectFilterColumn } from '@models/select-filter-column';
import { TextFilterColumn } from '@models/text-filter-column';
import { IntegrationPopupComponent } from '@modules/administration/popups/integration-popup/integration-popup.component';
import { MawaredEmployeePopupComponent } from '@modules/administration/popups/mawared-employee-popup/mawared-employee-popup.component';
import { LookupService } from '@services/lookup.service';
import { MawaredEmployeeService } from '@services/mawared-employee.service';
import { ReplaySubject, takeUntil } from 'rxjs';
import { finalize, map, take } from 'rxjs/operators';

@Component({
  selector: 'app-mawared-employee',
  templateUrl: './mawared-employee.component.html',
  styleUrls: ['./mawared-employee.component.scss'],
})
export class MawaredEmployeeComponent
  extends AdminComponent<
    MawaredEmployeePopupComponent,
    MawaredEmployee,
    MawaredEmployeeService
  >
  implements OnInit
{
  service = inject(MawaredEmployeeService);
  openSyncPopup$ = new ReplaySubject<void>(1);

  commonStatus: Lookup[] = inject(LookupService).lookups.commonStatus.filter(
    lookupItem => lookupItem.lookupKey !== StatusTypes.DELETED,
  );

  userPrivacy = [
    new Lookup().clone<Lookup>({
      arName: 'نعم',
      enName: 'Yes',
      status: true,
    }),
    new Lookup().clone<Lookup>({
      arName: 'لا',
      enName: 'No',
      status: false,
    }),
  ];

  actions: ContextMenuActionContract<MawaredEmployee>[] = [
    {
      name: 'view',
      type: 'action',
      label: 'view',
      icon: AppIcons.VIEW,
      callback: item => {
        this.view$.next(item);
      },
    },
    {
      name: 'audit',
      type: 'action',
      label: 'audit',
      icon: AppIcons.HISTORY,
      callback: item => {
        this.viewAudit$.next(item);
      },
    },
  ];

  columnsWrapper: ColumnsWrapper<MawaredEmployee> = new ColumnsWrapper(
    new NoneFilterColumn('select'),
    new TextFilterColumn('arName'),
    new TextFilterColumn('enName'),
    new NoneFilterColumn('employeeDepartment'),
    new TextFilterColumn('qid'),
    new TextFilterColumn('employeeNo'),
    new SelectFilterColumn(
      'isPrivateUser',
      this.userPrivacy,
      'status',
      'getNames',
    ),
    new SelectFilterColumn(
      'status',
      this.commonStatus,
      'lookupKey',
      'getNames',
    ),

    new NoneFilterColumn('actions'),
  ).attacheFilter(this.filter$);

  override ngOnInit() {
    super.ngOnInit();
    this.listenToOpenSyncPopup();
  }

  protected listenToOpenSyncPopup() {
    this.openSyncPopup$
      .pipe(takeUntil(this.destroy$))
      .pipe(
        map(() =>
          this.dialog
            .open(IntegrationPopupComponent, {
              data: { fromComponent: IntegrationsCases.MAWARED_EMPLOYEE },
            })
            .afterClosed(),
        ),
      )
      .subscribe();
  }

  updateUserPrivacy(user: MawaredEmployee) {
    this.loadingSubject.next(true);
    this.service
      .updateUserPrivacy(user.id)
      .pipe(
        take(1),
        finalize(() => this.loadingSubject.next(false)),
      )
      .subscribe(() => {
        user.isPrivateUser = !user.isPrivateUser;
      });
  }
}
