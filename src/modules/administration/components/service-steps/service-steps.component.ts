import { Component, inject } from '@angular/core';
import { AdminComponent } from '@abstracts/admin-component';
import { ServiceSteps } from '@models/service-steps';
import { ServiceStepsService } from '@services/service-steps.service';
import { ServiceStepsPopupComponent } from '@modules/administration/popups/service-steps-popup/service-steps-popup.component';
import { ContextMenuActionContract } from '@contracts/context-menu-action-contract';
import { AppIcons } from '@constants/app-icons';
import { ColumnsWrapper } from '@models/columns-wrapper';
import { TextFilterColumn } from '@models/text-filter-column';
import { NoneFilterColumn } from '@models/none-filter-column';

@Component({
  selector: 'app-service-steps',
  templateUrl: './service-steps.component.html',
  styleUrls: ['./service-steps.component.scss'],
})
export class ServiceStepsComponent extends AdminComponent<ServiceStepsPopupComponent, ServiceSteps, ServiceStepsService> {
  service = inject(ServiceStepsService);
  actions: ContextMenuActionContract<ServiceSteps>[] = [
    {
      name: 'edit',
      type: 'action',
      label: 'edit',
      icon: AppIcons.EDIT,
      callback: item => {
        this.edit$.next(item);
      },
    },
  ];
  // here we have a new implementation for displayed/filter Columns for the table
  columnsWrapper: ColumnsWrapper<ServiceSteps> = new ColumnsWrapper(
    new NoneFilterColumn('select'),
    new TextFilterColumn('arName'),
    new TextFilterColumn('enName'),
    new TextFilterColumn('stepName'),
    new NoneFilterColumn('actions')
  ).attacheFilter(this.filter$);
}
