import { Injectable } from '@angular/core';
import { PenaltyDetails } from '@models/penalty-details';
import { CastResponseContainer } from 'cast-response';
import { BaseCrudWithDialogService } from '@abstracts/base-crud-with-dialog-service';
import { ComponentType } from '@angular/cdk/portal';
import { PenaltyDetailsPopupComponent } from '@modules/administration/popups/penalty-details-popup/penalty-details-popup.component';
import { Constructor } from '@app-types/constructors';
import { Pagination } from '@models/pagination';

@CastResponseContainer({
  $pagination: {
    model: () => Pagination,
    shape: {
      'rs.*': () => PenaltyDetails,
    },
  },
  $default: {
    model: () => PenaltyDetails,
  },
})
@Injectable({
  providedIn: 'root',
})
export class PenaltyDetailsService extends BaseCrudWithDialogService<
  PenaltyDetailsPopupComponent,
  PenaltyDetails
> {
  serviceName = 'PenaltyDetailsService';
  protected getModelClass(): Constructor<PenaltyDetails> {
    return PenaltyDetails;
  }

  protected getModelInstance(): PenaltyDetails {
    return new PenaltyDetails();
  }

  getDialogComponent(): ComponentType<PenaltyDetailsPopupComponent> {
    return PenaltyDetailsPopupComponent;
  }

  getUrlSegment(): string {
    throw 'no function';
    // return this.urlService.URLS.PENALTY_DETAILS;
  }
}
