import { inject, Injectable } from '@angular/core';
import { Constructor } from '@app-types/constructors';
import { InvestigationReport } from '@models/investigation-report';
import { CastResponseContainer } from 'cast-response';
import { Pagination } from '@models/pagination';
import { BaseCrudWithDialogService } from '@abstracts/base-crud-with-dialog-service';
import { InvestigationReportPopupComponent } from '@standalone/popups/investigation-report-poup/investigation-report-popup.component';
import { ComponentType } from '@angular/cdk/portal';
import { Observable } from 'rxjs';
import { BlobModel } from '@models/blob-model';
import { map } from 'rxjs/operators';
import { DomSanitizer } from '@angular/platform-browser';
import { HttpParams } from '@angular/common/http';

@CastResponseContainer({
  $default: {
    model: () => InvestigationReport,
  },
  $pagination: {
    model: () => Pagination,
    shape: {
      'rs.*': () => InvestigationReport,
    },
  },
})
@Injectable({
  providedIn: 'root',
})
export class InvestigationReportService extends BaseCrudWithDialogService<
  InvestigationReportPopupComponent,
  InvestigationReport
> {
  protected override getDialogComponent(): ComponentType<InvestigationReportPopupComponent> {
    return InvestigationReportPopupComponent;
  }

  override serviceName: string = 'InvestigationReportService';
  domSanitizer = inject(DomSanitizer);

  protected override getUrlSegment(): string {
    return this.urlService.URLS.INVESTIGATION_REPORT;
  }

  protected override getModelInstance() {
    return new InvestigationReport();
  }

  protected override getModelClass(): Constructor<InvestigationReport> {
    return InvestigationReport;
  }

  downloadReport(reportId: number): Observable<BlobModel> {
    return this.http
      .get(this.getUrlSegment() + '/' + reportId + '/download', {
        responseType: 'blob',
      })
      .pipe(
        map(blob => {
          return new BlobModel(blob, this.domSanitizer);
        }),
      );
  }

  uploadReport(
    file: File,
    params: Record<string, string>,
  ): Observable<unknown> {
    const formData = new FormData();
    formData.set('content', file);
    return this.http.post(
      this.urlService.URLS.INVESTIGATION + '/report/approved-document/upload',
      formData,
      {
        params: new HttpParams({
          fromObject: { ...params },
        }),
      },
    );
  }
}
