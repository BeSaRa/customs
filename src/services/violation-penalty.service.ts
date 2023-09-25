import { Injectable } from '@angular/core';
import { ViolationPenalty } from '@models/violation-penalty';
import { CastResponseContainer } from 'cast-response';
import { BaseCrudWithDialogService } from '@abstracts/base-crud-with-dialog-service';
import { ComponentType } from '@angular/cdk/portal';
import { ViolationPenaltyPopupComponent } from '@modules/administration/popups/violation-penalty-popup/violation-penalty-popup.component';
import { Constructor } from '@app-types/constructors';
import { Pagination } from '@models/pagination';

@CastResponseContainer({
  $pagination: {
    model: () => Pagination,
    shape: {
      'rs.*': () => ViolationPenalty,
    },
  },
  $default: {
    model: () => ViolationPenalty,
  },
})
@Injectable({
  providedIn: 'root',
})
export class ViolationPenaltyService extends BaseCrudWithDialogService<ViolationPenaltyPopupComponent, ViolationPenalty> {
  serviceName = 'ViolationPenaltyService';
  protected getModelClass(): Constructor<ViolationPenalty> {
    return ViolationPenalty;
  }

  protected getModelInstance(): ViolationPenalty {
    return new ViolationPenalty();
  }

  getDialogComponent(): ComponentType<ViolationPenaltyPopupComponent> {
    return ViolationPenaltyPopupComponent;
  }

  getUrlSegment(): string {
    return this.urlService.URLS.VIOLATION_PENALTY;
  }
}
