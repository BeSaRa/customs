import { Injectable } from '@angular/core';
import { ClearingAgent } from '@models/clearing-agent';
import { CastResponse, CastResponseContainer } from 'cast-response';
import { BaseCrudWithDialogService } from '@abstracts/base-crud-with-dialog-service';
import { ComponentType } from '@angular/cdk/portal';
import { ClearingAgentPopupComponent } from '@modules/administration/popups/clearing-agent-popup/clearing-agent-popup.component';
import { Constructor } from '@app-types/constructors';
import { Pagination } from '@models/pagination';
import { Observable } from 'rxjs';
import { HttpParams } from '@angular/common/http';

@CastResponseContainer({
  $pagination: {
    model: () => Pagination,
    shape: {
      'rs.*': () => ClearingAgent,
    },
  },
  $default: {
    model: () => ClearingAgent,
  },
})
@Injectable({
  providedIn: 'root',
})
export class ClearingAgentService extends BaseCrudWithDialogService<
  ClearingAgentPopupComponent,
  ClearingAgent
> {
  serviceName = 'ClearingAgentService';

  protected getModelClass(): Constructor<ClearingAgent> {
    return ClearingAgent;
  }

  protected getModelInstance(): ClearingAgent {
    return new ClearingAgent();
  }

  getDialogComponent(): ComponentType<ClearingAgentPopupComponent> {
    return ClearingAgentPopupComponent;
  }

  getUrlSegment(): string {
    return this.urlService.URLS.CLEARING_AGENT;
  }

  @CastResponse()
  syncForIntegration(options: {
    startDate: string;
    endDate: string;
  }): Observable<ClearingAgent[]> {
    return this.http.get<ClearingAgent[]>(
      this.getUrlSegment() + `/integration`,
      {
        params: new HttpParams({
          fromObject: { ...options },
        }),
      },
    );
  }
}
