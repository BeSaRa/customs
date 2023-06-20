import { AuditComponent } from '@abstracts/audit-component';
import { Component, inject } from '@angular/core';
import { AppTableDataSource } from '@models/app-table-data-source';
import { Audit } from '@models/audit';
import { ColumnsWrapper } from '@models/columns-wrapper';
import { NoneFilterColumn } from '@models/none-filter-column';
import { Pagination } from '@models/pagination';
import { TextFilterColumn } from '@models/text-filter-column';
import { JobTitleService } from '@services/job-title.service';
import { LangService } from '@services/lang.service';
import { Observable, map, of, pipe, switchMap } from 'rxjs';

@Component({
  selector: 'app-job-title-audit-popup',
  templateUrl: './job-title-audit-popup.component.html',
  styleUrls: ['./job-title-audit-popup.component.scss'],
})
export class JobTitleAuditPopupComponent extends AuditComponent<JobTitleService> {
  service = inject(JobTitleService);
  data$: Observable<Audit[]> = this._load();

  dataSource: AppTableDataSource<Audit> = new AppTableDataSource<Audit>(this.data$);

  protected _load(): Observable<Audit[]> {
    return this.service.loadAudit(147).pipe(map(response => response.rs));
  }
  columnsWrapper: ColumnsWrapper<Audit> = new ColumnsWrapper(new NoneFilterColumn('auditId'));
}
