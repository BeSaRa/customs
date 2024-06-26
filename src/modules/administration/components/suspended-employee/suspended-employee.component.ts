import { Component, inject, OnInit } from '@angular/core';
import { AdminComponent } from '@abstracts/admin-component';
import { SuspendedEmployee } from '@models/suspended-employee';
import { SuspendedEmployeeService } from '@services/suspended-employee.service';
import { SuspendedEmployeePopupComponent } from '@modules/administration/popups/suspended-employee-popup/suspended-employee-popup.component';
import { ContextMenuActionContract } from '@contracts/context-menu-action-contract';
import { AppIcons } from '@constants/app-icons';
import { ColumnsWrapper } from '@models/columns-wrapper';
import { TextFilterColumn } from '@models/text-filter-column';
import { NoneFilterColumn } from '@models/none-filter-column';
import { DateFilterColumn } from '@models/date-filter-column';
import { Lookup } from '@models/lookup';
import { StatusTypes } from '@enums/status-types';
import { SelectFilterColumn } from '@models/select-filter-column';
import { filter, Subject, switchMap, takeUntil } from 'rxjs';

@Component({
  selector: 'app-suspended-employee',
  templateUrl: './suspended-employee.component.html',
  styleUrls: ['./suspended-employee.component.scss'],
})
export class SuspendedEmployeeComponent
  extends AdminComponent<
    SuspendedEmployeePopupComponent,
    SuspendedEmployee,
    SuspendedEmployeeService
  >
  implements OnInit
{
  service = inject(SuspendedEmployeeService);
  commonStatus: Lookup[] = this.lookupService.lookups.commonStatus.filter(
    s => s.lookupKey !== StatusTypes.DELETED,
  );
  suspensionTypes: Lookup[] = this.lookupService.lookups.suspensionTypes;
  extendSuspension$: Subject<SuspendedEmployee> =
    new Subject<SuspendedEmployee>();
  actions: ContextMenuActionContract<SuspendedEmployee>[] = [
    {
      name: 'Extend suspension',
      type: 'action',
      label: 'extend_suspension',
      icon: AppIcons.EDIT,
      callback: item => {
        this.extendSuspension$.next(item);
      },
    },
  ];

  override ngOnInit(): void {
    super.ngOnInit();
    this._listenToExtendSuspension();
  }

  _listenToExtendSuspension() {
    this.extendSuspension$
      .pipe(takeUntil(this.destroy$))
      .pipe(
        switchMap(model => {
          return this.service
            .openExtendSuspensionDialog(model, this._getEditExtras() as object)
            .afterClosed()
            .pipe(
              filter((model): model is SuspendedEmployee => {
                return this.service.isInstanceOf(model);
              }),
            );
        }),
      )
      .subscribe(() => {
        this.reload$.next();
      });
  }

  canExtendSuspension(): boolean {
    return (
      this.employeeService.isDisciplinaryCommittee() !== undefined ||
      this.employeeService.isPermanentDisciplinaryCommittee() !== undefined
    );
  }

  // here we have a new implementation for displayed/filter Columns for the table
  columnsWrapper: ColumnsWrapper<SuspendedEmployee> = new ColumnsWrapper(
    new NoneFilterColumn('select'),
    new TextFilterColumn('arName'),
    new TextFilterColumn('enName'),
    new TextFilterColumn('OU'),
    new TextFilterColumn('employeeNo'),
    new TextFilterColumn('qid'),
    new TextFilterColumn('serial'),
    new TextFilterColumn('decision'),
    new DateFilterColumn('decisionDate'),
    new DateFilterColumn('dateFrom'),
    new DateFilterColumn('dateTo'),
    new TextFilterColumn('duration'),
    new SelectFilterColumn(
      'type',
      this.suspensionTypes,
      'lookupKey',
      'getNames',
    ),
    new TextFilterColumn('signerName'),
    new SelectFilterColumn(
      'status',
      this.commonStatus,
      'lookupKey',
      'getNames',
    ),
    new NoneFilterColumn('actions'),
    new TextFilterColumn('extendSuspendEmployee'),
  ).attacheFilter(this.filter$);
}
