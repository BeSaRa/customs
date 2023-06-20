import { Component, inject } from '@angular/core';
import { AdminComponent } from '@abstracts/admin-component';
import { JobTitle } from '@models/job-title';
import { JobTitleService } from '@services/job-title.service';
import { JobTitlePopupComponent } from '@modules/administration/popups/job-title-popup/job-title-popup.component';
import { AppIcons } from '@constants/app-icons';
import { ContextMenuActionContract } from '@contracts/context-menu-action-contract';
import { ColumnsWrapper } from '@models/columns-wrapper';
import { NoneFilterColumn } from '@models/none-filter-column';
import { TextFilterColumn } from '@models/text-filter-column';
import { SelectFilterColumn } from '@models/select-filter-column';
import { StatusTypes } from '@enums/status-types';

@Component({
  selector: 'app-job-title',
  templateUrl: './job-title.component.html',
  styleUrls: ['./job-title.component.scss'],
})
export class JobTitleComponent extends AdminComponent<JobTitlePopupComponent, JobTitle, JobTitleService> {
  service = inject(JobTitleService);
  actions: ContextMenuActionContract<JobTitle>[] = [
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
      name: 'audit',
      type: 'action',
      label: 'audit',
      icon: AppIcons.HISTORY,
      callback: item => {
        this.viewAudit$.next(item);
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
  columnsWrapper: ColumnsWrapper<JobTitle> = new ColumnsWrapper(
    new NoneFilterColumn('select'),
    new TextFilterColumn('arName'),
    new TextFilterColumn('enName'),
    new SelectFilterColumn(
      'status',
      this.lookupService.lookups.commonStatus.filter(item => item.lookupKey !== StatusTypes.DELETED),
      'lookupKey',
      'getNames'
    ),
    new SelectFilterColumn('jobType', this.lookupService.lookups.userType, 'lookupKey', 'getNames'),
    new NoneFilterColumn('actions')
  ).attacheFilter(this.filter$);
}
