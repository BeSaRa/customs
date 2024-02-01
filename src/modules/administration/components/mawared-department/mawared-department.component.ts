import { Component, inject, OnInit } from '@angular/core';
import { AdminComponent } from '@abstracts/admin-component';
import { MawaredDepartment } from '@models/mawared-department';
import { MawaredDepartmentService } from '@services/mawared-department.service';
import { MawaredDepartmentPopupComponent } from '@modules/administration/popups/mawared-department-popup/mawared-department-popup.component';
import { ContextMenuActionContract } from '@contracts/context-menu-action-contract';
import { AppIcons } from '@constants/app-icons';
import { ColumnsWrapper } from '@models/columns-wrapper';
import { TextFilterColumn } from '@models/text-filter-column';
import { NoneFilterColumn } from '@models/none-filter-column';
import { SelectFilterColumn } from '@models/select-filter-column';
import { StatusTypes } from '@enums/status-types';
import { filter, ReplaySubject, switchMap, takeUntil } from 'rxjs';

@Component({
  selector: 'app-mawared-department',
  templateUrl: './mawared-department.component.html',
  styleUrls: ['./mawared-department.component.scss'],
})
export class MawaredDepartmentComponent
  extends AdminComponent<
    MawaredDepartmentPopupComponent,
    MawaredDepartment,
    MawaredDepartmentService
  >
  implements OnInit
{
  service = inject(MawaredDepartmentService);
  sync$ = new ReplaySubject<void>(1);

  actions: ContextMenuActionContract<MawaredDepartment>[] = [
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
  columnsWrapper: ColumnsWrapper<MawaredDepartment> = new ColumnsWrapper(
    new NoneFilterColumn('select'),
    new TextFilterColumn('arName'),
    new TextFilterColumn('enName'),
    new TextFilterColumn('ldapCode'),
    new SelectFilterColumn(
      'status',
      this.lookupService.lookups.commonStatus.filter(
        item => item.lookupKey !== StatusTypes.DELETED,
      ),
      'lookupKey',
      'getNames',
    ),
    new NoneFilterColumn('actions'),
  ).attacheFilter(this.filter$);

  override ngOnInit() {
    super.ngOnInit();
    this.listenToSync();
  }

  protected listenToSync() {
    this.sync$
      .pipe(takeUntil(this.destroy$))
      .pipe(
        switchMap(() => {
          return this.service.syncForIntegration();
        }),
      )
      .subscribe(() => this.reload$.next());
  }
}
