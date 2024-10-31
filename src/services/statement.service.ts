import { inject, Injectable } from '@angular/core';
import { DialogService } from '@services/dialog.service';
import { RequestStatementPopupComponent } from '@standalone/popups/request-statement-popup/request-statement-popup.component';
import { Investigation } from '@models/investigation';
import { RequestStatement } from '@models/request-statement';
import { CastResponse } from 'cast-response';
import { HttpClient, HttpParams } from '@angular/common/http';
import { UrlService } from '@services/url.service';

@Injectable({
  providedIn: 'root',
})
export class StatementService {
  protected http: HttpClient = inject(HttpClient);
  protected dialog = inject(DialogService);
  protected urlService = inject(UrlService);

  getUrlSegment(): string {
    return this.urlService.URLS.REQUEST_STATEMENT;
  }
  openRequestStatementDialog(model: Investigation) {
    return this.dialog.open(RequestStatementPopupComponent, {
      data: {
        model,
      },
    });
  }
  openRequestStatementDialogForRework(model: Investigation) {
    return this.dialog.open(RequestStatementPopupComponent, {
      data: {
        model,
        extras: {
          forRework: true,
        },
      },
    });
  }
  @CastResponse()
  requestStatement(requestStatement: RequestStatement) {
    return this.http.post<RequestStatement>(
      this.getUrlSegment() + `/${requestStatement.caseId}/start`,
      requestStatement,
    );
  }
  updateDescription(requestStatement: RequestStatement, descriptionId: number) {
    const url = `${this.getUrlSegment()}/${descriptionId}`;
    const params = new HttpParams().set('descId', descriptionId);
    return this.http.put<RequestStatement>(url, requestStatement, {
      params: params,
    });
  }
}
