import { Component, inject } from '@angular/core';
import { AdminComponent } from '@abstracts/admin-component';
import { SuspendedEmployee } from '@models/suspended-employee';
import { SuspendedEmployeeService } from '@services/suspended-employee.service';
import { SuspendedEmployeePopupComponent } from '@modules/administration/popups/suspended-employee-popup/suspended-employee-popup.component';
import { ContextMenuActionContract } from '@contracts/context-menu-action-contract';
import { AppIcons } from '@constants/app-icons';
import { ColumnsWrapper } from '@models/columns-wrapper';
import { TextFilterColumn } from '@models/text-filter-column';
import { NoneFilterColumn } from '@models/none-filter-column';

@Component({
  selector: 'app-suspended-employee',
  templateUrl: './suspended-employee.component.html',
  styleUrls: ['./suspended-employee.component.scss'],
})
export class SuspendedEmployeeComponent extends AdminComponent<SuspendedEmployeePopupComponent, SuspendedEmployee, SuspendedEmployeeService> {
  service = inject(SuspendedEmployeeService);
  actions: ContextMenuActionContract<SuspendedEmployee>[] = [
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
      name: 'edit',
      type: 'action',
      label: 'edit',
      icon: AppIcons.EDIT,
      callback: item => {
        this.edit$.next(item);
      },
    },
    {
      name: 'delete',
      type: 'action',
      label: 'delete',
      icon: AppIcons.DELETE,
      callback: item => {
        this.delete$.next(item);
      },
    },
  ];
  // here we have a new implementation for displayed/filter Columns for the table
  columnsWrapper: ColumnsWrapper<SuspendedEmployee> = new ColumnsWrapper(
    new NoneFilterColumn('select'),
    new TextFilterColumn('arName'),
    new NoneFilterColumn('actions')
  ).attacheFilter(this.filter$);
}
