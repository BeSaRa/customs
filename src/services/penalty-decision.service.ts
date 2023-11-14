import { BaseCrudWithDialogService } from '@abstracts/base-crud-with-dialog-service';
import { ComponentType } from '@angular/cdk/portal';
import { Injectable } from '@angular/core';
import { Constructor } from '@app-types/constructors';
import { PenaltyDecision } from '@models/penalty-decision';
import { MakePenaltyDecisionPopupComponent } from '@standalone/popups/make-penalty-decision-popup/make-penalty-decision-popup.component';

@Injectable({
  providedIn: 'root',
})
export class PenaltyDecisionService extends BaseCrudWithDialogService<MakePenaltyDecisionPopupComponent, PenaltyDecision> {
  constructor() {
    super();
  }

  protected override getDialogComponent(): ComponentType<MakePenaltyDecisionPopupComponent> {
    throw new Error('Method not implemented.');
  }
  override serviceName!: string;
  protected override getUrlSegment(): string {
    return this.urlService.URLS.PENALTY_DECISION;
  }
  protected override getModelInstance(): PenaltyDecision {
    return new PenaltyDecision();
  }
  protected override getModelClass(): Constructor<PenaltyDecision> {
    return PenaltyDecision;
  }
}
