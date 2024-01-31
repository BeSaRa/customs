import { Injectable } from '@angular/core';
import { Penalty } from '@models/penalty';
import { CastResponse, CastResponseContainer } from 'cast-response';
import { BaseCrudWithDialogService } from '@abstracts/base-crud-with-dialog-service';
import { ComponentType } from '@angular/cdk/portal';
import { PenaltyPopupComponent } from '@modules/administration/popups/penalty-popup/penalty-popup.component';
import { Constructor } from '@app-types/constructors';
import { Pagination } from '@models/pagination';
import { Observable } from 'rxjs';
import { HttpParams } from '@angular/common/http';

@CastResponseContainer({
  $pagination: {
    model: () => Pagination,
    shape: {
      'rs.*': () => Penalty,
    },
  },
  $default: {
    model: () => Penalty,
  },
})
@Injectable({
  providedIn: 'root',
})
export class PenaltyService extends BaseCrudWithDialogService<
  PenaltyPopupComponent,
  Penalty
> {
  serviceName = 'PenaltyService';

  protected getModelClass(): Constructor<Penalty> {
    return Penalty;
  }

  protected getModelInstance(): Penalty {
    return new Penalty();
  }

  getDialogComponent(): ComponentType<PenaltyPopupComponent> {
    return PenaltyPopupComponent;
  }

  getUrlSegment(): string {
    return this.urlService.URLS.PENALTY;
  }

  @CastResponse(() => Penalty, { unwrap: 'rs', fallback: '$default' })
  getFilteredPenalties(
    options: Partial<{ penaltySigner: number; offenderLevel: number }>,
  ): Observable<Penalty[]> {
    return this.http.get<Penalty[]>(this.getUrlSegment() + `/violation`, {
      params: new HttpParams({
        fromObject: { ...options },
      }),
    });
  }
}
