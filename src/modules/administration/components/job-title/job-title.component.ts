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
  jobTypes: Lookup[] = inject(LookupService).lookups.userType;
  jobStatus: Lookup[] = inject(LookupService).lookups.commonStatus;
  displayedColumns: string[] = [
    'select',
    'arName',
    'enName',
    'status',
    'jobType',
    'actions',
  ];
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

  getJobTypeName(jobType: number): string {
    switch (this.lang.getCurrent().code) {
      case LangCodes.AR:
        return (
          this.jobTypes.find((type) => type.lookupKey === jobType)?.arName || ''
        );
      case LangCodes.EN:
        return (
          this.jobTypes.find((type) => type.lookupKey === jobType)?.enName || ''
        );
      default:
        return (
          this.jobTypes.find((type) => type.lookupKey === jobType)?.arName || ''
        );
    }
  }

  showEditAndDeleteAction(jobTitleStatus: number) {
    return jobTitleStatus !== StatusTypes.DELETED;
  }
  getJobTitleStatus(jobTitleStatus: number): { status: string; class: string } {
    const className: string =
      this.jobStatus.find((status) => status.lookupKey === jobTitleStatus)
        ?.enName || '';
    switch (this.lang.getCurrent().code) {
      case LangCodes.AR:
        return {
          status:
            this.jobStatus.find((status) => status.lookupKey === jobTitleStatus)
              ?.arName || '',
          class: className,
        };
      case LangCodes.EN:
        return {
          status: className,
          class: className,
        };
      default:
        return {
          status: className,
          class: className,
        };
    }
  }
}
