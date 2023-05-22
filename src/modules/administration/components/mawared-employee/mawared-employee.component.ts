import { Component, inject } from '@angular/core';
import { AdminComponent } from '@abstracts/admin-component';
import { MawaredEmployee } from '@models/mawared-employee';
import { MawaredEmployeeService } from '@services/mawared-employee.service';
import { MawaredEmployeePopupComponent } from '@modules/administration/popups/mawared-employee-popup/mawared-employee-popup.component';
import { ColumnsWrapper } from '@models/columns-wrapper';
import { TextFilterColumn } from '@models/text-filter-column';
import { NoneFilterColumn } from '@models/none-filter-column';
import { ContextMenuActionContract } from '@contracts/context-menu-action-contract';
import { AppIcons } from '@constants/app-icons';

@Component({
  selector: 'app-mawared-employee',
  templateUrl: './mawared-employee.component.html',
  styleUrls: ['./mawared-employee.component.scss'],
})
export class MawaredEmployeeComponent extends AdminComponent<
  MawaredEmployeePopupComponent,
  MawaredEmployee,
  MawaredEmployeeService
> {
  service = inject(MawaredEmployeeService);

  actions: ContextMenuActionContract<MawaredEmployee>[] = [
    {
      name: 'view',
      type: 'action',
      label: 'view',
      icon: AppIcons.VIEW,
      callback: (item) => {
        this.view$.next(item);
      },
    },
  ];

  columnsWrapper: ColumnsWrapper<MawaredEmployee> = new ColumnsWrapper(
    new NoneFilterColumn('select'),
    new TextFilterColumn('arName'),
    new TextFilterColumn('enName'),
    new NoneFilterColumn('actions')
  ).attacheFilter(this.filter$);
}
