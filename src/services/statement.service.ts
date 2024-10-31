import { inject, Injectable } from '@angular/core';
import { DialogService } from '@services/dialog.service';
import { RequestStatementPopupComponent } from '@standalone/popups/request-statement-popup/request-statement-popup.component';
import { Investigation } from '@models/investigation';
import { RequestStatement } from '@models/request-statement';
import { CastResponse } from 'cast-response';
import { HttpClient } from '@angular/common/http';
import { UrlService } from '@services/url.service';
import { Grievance } from '@models/grievance';

@Injectable({
  providedIn: 'root',
})
export class StatementService {
  protected http: HttpClient = inject(HttpClient);
  protected dialog = inject(DialogService);
  protected urlService = inject(UrlService);

  getUrlSegment(grievanceStatementRequest: boolean): string {
    return grievanceStatementRequest
      ? this.urlService.URLS.GRIEVANCE_REQUEST_STATEMENT
      : this.urlService.URLS.REQUEST_STATEMENT;
  }
  openRequestStatementDialog(
    model: Investigation | Grievance,
    grievanceStatementRequest = false,
  ) {
    return this.dialog.open(RequestStatementPopupComponent, {
      data: {
        model,
        extras: {
          grievanceStatementRequest: grievanceStatementRequest,
        },
      },
    });
  }

  @CastResponse()
  requestStatement(
    requestStatement: RequestStatement,
    grievanceStatementRequest: boolean,
  ) {
    return this.http.post<RequestStatement>(
      this.getUrlSegment(grievanceStatementRequest) +
        `/${requestStatement.caseId}/start`,
      requestStatement,
    );
  }
}
