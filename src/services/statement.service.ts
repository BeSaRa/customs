import { inject, Injectable } from '@angular/core';
import { DialogService } from '@services/dialog.service';
import { RequestStatementPopupComponent } from '@standalone/popups/request-statement-popup/request-statement-popup.component';
import { Investigation } from '@models/investigation';
import { RequestStatement } from '@models/request-statement';
import { CastResponse } from 'cast-response';
import { HttpClient, HttpParams } from '@angular/common/http';
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
    forRework = false,
  ) {
    return this.dialog.open(RequestStatementPopupComponent, {
      data: {
        model,
        extras: {
          grievanceStatementRequest: grievanceStatementRequest,
          forRework: forRework,
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

  updateDescription(requestStatement: RequestStatement, descriptionId: number) {
    const url = `${this.getUrlSegment(false)}/${descriptionId}`;
    const params = new HttpParams().set('descId', descriptionId);
    return this.http.put<RequestStatement>(url, requestStatement, {
      params: params,
    });
  }
}
