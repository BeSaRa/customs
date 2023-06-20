import { Injectable } from '@angular/core';
import { JobTitle } from '@models/job-title';
import { CastResponseContainer } from 'cast-response';
import { BaseCrudWithDialogService } from '@abstracts/base-crud-with-dialog-service';
import { ComponentType } from '@angular/cdk/portal';
import { JobTitlePopupComponent } from '@modules/administration/popups/job-title-popup/job-title-popup.component';
import { Constructor } from '@app-types/constructors';
import { Pagination } from '@models/pagination';
import { JobTitleAuditPopupComponent } from '@modules/administration/popups/job-title-audit-popup/job-title-audit-popup.component';

@CastResponseContainer({
  $pagination: {
    model: () => Pagination,
    shape: {
      'rs.*': () => JobTitle,
    },
  },
  $default: {
    model: () => JobTitle,
  },
})
@Injectable({
  providedIn: 'root',
})
export class JobTitleService extends BaseCrudWithDialogService<JobTitlePopupComponent, JobTitle> {
  protected override getAuditDialogComponent(): any {
    return JobTitleAuditPopupComponent;
  }

  serviceName = 'JobTitleService';
  protected getModelClass(): Constructor<JobTitle> {
    return JobTitle;
  }

  protected getModelInstance(): JobTitle {
    return new JobTitle();
  }

  getDialogComponent(): ComponentType<JobTitlePopupComponent> {
    return JobTitlePopupComponent;
  }

  getUrlSegment(): string {
    return this.urlService.URLS.JOB_TITLE;
  }
}
