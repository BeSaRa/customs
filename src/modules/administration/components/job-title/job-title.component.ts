import { Component, ViewChild, inject } from '@angular/core';
import { AdminComponent } from '@abstracts/admin-component';
import { JobTitle } from '@models/job-title';
import { JobTitleService } from '@services/job-title.service';
import { JobTitlePopupComponent } from '@modules/administration/popups/job-title-popup/job-title-popup.component';
import { LookupService } from '@services/lookup.service';
import { LangCodes } from '@enums/lang-codes';
import { Lookup } from '@models/lookup';
import { StatusTypes } from '@enums/status-types';
import { MatMenuTrigger } from '@angular/material/menu';
import { AppIcons } from '@constants/app-icons';
import { ContextMenuActionContract } from '@contracts/context-menu-action-contract';
import { ColumnsWrapper } from '@models/columns-wrapper';
import { NoneFilterColumn } from '@models/none-filter-column';
import { TextFilterColumn } from '@models/text-filter-column';
import { SelectFilterColumn } from '@models/select-filter-column';

@Component({
  selector: 'app-job-title',
  templateUrl: './job-title.component.html',
  styleUrls: ['./job-title.component.scss'],
})
export class JobTitleComponent extends AdminComponent<
  JobTitlePopupComponent,
  JobTitle,
  JobTitleService
> {
  service = inject(JobTitleService);
  jobTypes: Lookup[] = inject(LookupService).lookups.userType.filter(
    (x) => x.lookupKey !== 3
  ); // exclude 'All' entry from lookupMaps that backend returns
  // waiting for Ebrahim to fix that
  jobStatus: Lookup[] = inject(LookupService).lookups.commonStatus;
  isArabic: boolean = this.lang.getCurrent().code === LangCodes.AR;

  // here we have a new implementation for displayed/filter Columns for the table
  columnsWrapper: ColumnsWrapper<JobTitle> = new ColumnsWrapper(
    new NoneFilterColumn('select'),
    new TextFilterColumn('arName'),
    new TextFilterColumn('enName'),
    new SelectFilterColumn(
      'status',
      this.jobStatus,
      'lookupKey',
      this.isArabic ? 'arName' : 'enName'
    ),
    new SelectFilterColumn(
      'jobType',
      this.jobTypes,
      'lookupKey',
      this.isArabic ? 'arName' : 'enName'
    ),
    new NoneFilterColumn('actions')
  ).attacheFilter(this.filter$);
  actions: ContextMenuActionContract<JobTitle>[] = [
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

  @ViewChild('subTrigger', { read: MatMenuTrigger })
  trigger!: MatMenuTrigger;

  getJobTypeName(jobType: number) {
    return this.jobTypes.find((type) => type.lookupKey === jobType)?.getNames();
  }
  getJobTitleStatus(jobTitleStatus: number) {
    return this.jobStatus
      .find((status) => status.lookupKey === jobTitleStatus)
      ?.getNames();
  }
}
