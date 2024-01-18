import { Component, inject } from '@angular/core';
import { AdminComponent } from '@abstracts/admin-component';
import { EmailTemplate } from '@models/email-template';
import { EmailTemplateService } from '@services/email-template.service';
import { EmailTemplatePopupComponent } from '@modules/administration/popups/email-template-popup/email-template-popup.component';
import { ContextMenuActionContract } from '@contracts/context-menu-action-contract';
import { AppIcons } from '@constants/app-icons';
import { ColumnsWrapper } from '@models/columns-wrapper';
import { TextFilterColumn } from '@models/text-filter-column';
import { NoneFilterColumn } from '@models/none-filter-column';
import { SelectFilterColumn } from '@models/select-filter-column';
import { StatusTypes } from '@enums/status-types';
@Component({
  selector: 'app-email-template',
  templateUrl: './email-template.component.html',
  styleUrls: ['./email-template.component.scss'],
})
export class EmailTemplateComponent extends AdminComponent<
  EmailTemplatePopupComponent,
  EmailTemplate,
  EmailTemplateService
> {
  service = inject(EmailTemplateService);
  actions: ContextMenuActionContract<EmailTemplate>[] = [
    {
      name: 'view',
      type: 'action',
      label: 'view',
      icon: AppIcons.VIEW,
      callback: (item) => {
        this.view$.next(item);
      },
    },
    {
      name: 'edit',
      type: 'action',
      label: 'edit',
      icon: AppIcons.EDIT,
      callback: (item) => {
        this.edit$.next(item);
      },
    },
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
  columnsWrapper: ColumnsWrapper<EmailTemplate> = new ColumnsWrapper(
    new NoneFilterColumn('select'),
    new TextFilterColumn('arName'),
    new TextFilterColumn('enName'),
    new SelectFilterColumn(
      'status',
      this.lookupService.lookups.commonStatus.filter(
        (item) => item.lookupKey !== StatusTypes.DELETED,
      ),
      'lookupKey',
      'getNames',
    ),
    new NoneFilterColumn('actions'),
  ).attacheFilter(this.filter$);
}
