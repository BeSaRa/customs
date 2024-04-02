import { Injectable } from '@angular/core';
import { ClearingAgency } from '@models/clearing-agency';
import { CastResponse, CastResponseContainer } from 'cast-response';
import { BaseCrudWithDialogService } from '@abstracts/base-crud-with-dialog-service';
import { ComponentType } from '@angular/cdk/portal';
import { ClearingAgencyPopupComponent } from '@modules/administration/popups/clearing-agency-popup/clearing-agency-popup.component';
import { Constructor } from '@app-types/constructors';
import { Pagination } from '@models/pagination';
import { Observable } from 'rxjs';
import { HttpParams } from '@angular/common/http';
import { NadeebIntegration } from '@models/nadeeb-integration';

@CastResponseContainer({
  $pagination: {
    model: () => Pagination,
    shape: {
      'rs.*': () => ClearingAgency,
    },
  },
  $default: {
    model: () => ClearingAgency,
  },
})
@Injectable({
  providedIn: 'root',
})
export class ClearingAgencyService extends BaseCrudWithDialogService<
  ClearingAgencyPopupComponent,
  ClearingAgency
> {
  serviceName = 'ClearingAgencyService';

  protected getModelClass(): Constructor<ClearingAgency> {
    return ClearingAgency;
  }

  protected getModelInstance(): ClearingAgency {
    return new ClearingAgency();
  }

  getDialogComponent(): ComponentType<ClearingAgencyPopupComponent> {
    return ClearingAgencyPopupComponent;
  }

  getUrlSegment(): string {
    return this.urlService.URLS.CLEARING_AGENCY;
  }

  @CastResponse()
  syncForIntegration(
    options: NadeebIntegration,
  ): Observable<NadeebIntegration[]> {
    return this.http.get<NadeebIntegration[]>(
      this.getUrlSegment() + `/integration`,
      {
        params: new HttpParams({
          fromObject: { ...options },
        }),
      },
    );
  }
}
