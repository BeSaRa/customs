import { Injectable } from '@angular/core';
import { Constructor } from '@app-types/constructors';
import { InvestigationReport } from '@models/investigation-report';
import { CastResponseContainer } from 'cast-response';
import { Pagination } from '@models/pagination';
import { BaseCrudWithDialogService } from '@abstracts/base-crud-with-dialog-service';
import { InvestigationReportPopupComponent } from '@standalone/popups/investigation-report-poup/investigation-report-popup.component';
import { ComponentType } from '@angular/cdk/portal';

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

  protected override getUrlSegment(): string {
    return this.urlService.URLS.INVESTIGATION_REPORT;
  }

  protected override getModelInstance() {
    return new InvestigationReport();
  }

  protected override getModelClass(): Constructor<InvestigationReport> {
    return InvestigationReport;
  }
}
