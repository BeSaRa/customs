import { BaseCrudWithDialogService } from '@abstracts/base-crud-with-dialog-service';
import { ComponentType } from '@angular/cdk/portal';
import { EventEmitter, Injectable, InputSignal } from '@angular/core';
import { Constructor } from '@app-types/constructors';
import { PenaltyDecision } from '@models/penalty-decision';
import { MakePenaltyDecisionPopupComponent } from '@standalone/popups/make-penalty-decision-popup/make-penalty-decision-popup.component';
import { CastResponseContainer } from 'cast-response';
import { SingleDecisionPopupComponent } from '@standalone/popups/single-decision-popup/single-decision-popup.component';
import { Offender } from '@models/offender';
import { Investigation } from '@models/investigation';
import { Penalty } from '@models/penalty';
import { TerminatePopupComponent } from '@standalone/popups/terminate-popup/terminate-popup.component';
import { RequestReferralPopupComponent } from '@standalone/popups/request-referral-popup/request-referral-popup.component';
import { MatDialogRef } from '@angular/material/dialog';
import { TaskResponses } from '@enums/task-responses';

@CastResponseContainer({
  $default: {
    model: () => PenaltyDecision,
  },
})
@Injectable({
  providedIn: 'root',
})
export class PenaltyDecisionService extends BaseCrudWithDialogService<
  MakePenaltyDecisionPopupComponent,
  PenaltyDecision
> {
  override serviceName: string = 'PenaltyDecisionService';

  protected override getDialogComponent(): ComponentType<MakePenaltyDecisionPopupComponent> {
    throw new Error('Method not implemented.');
  }

  protected override getUrlSegment(): string {
    return this.urlService.URLS.PENALTY_DECISION;
  }

  protected override getModelInstance(): PenaltyDecision {
    return new PenaltyDecision();
  }

  protected override getModelClass(): Constructor<PenaltyDecision> {
    return PenaltyDecision;
  }

  openSingleDecisionDialog(
    offender: Offender,
    model: InputSignal<Investigation>,
    updateModel: InputSignal<EventEmitter<void>>,
    offenderPenalties: { first: number | null; second: Penalty[] },
  ) {
    return this.dialog.open(SingleDecisionPopupComponent, {
      data: {
        offender,
        model,
        updateModel,
        offenderPenalties,
      },
    });
  }

  openTerminateDialog(
    offenders: Offender[],
    model: InputSignal<Investigation>,
    updateModel: InputSignal<EventEmitter<void>>,
    selectedPenalty: Penalty,
  ): MatDialogRef<unknown> {
    return this.dialog.open(TerminatePopupComponent, {
      data: {
        offenders,
        model,
        updateModel,
        selectedPenalty,
        isSingle: offenders.length === 1,
      },
    });
  }

  openRequestReferralDialog(
    offenders: Offender[],
    model: InputSignal<Investigation>,
    updateModel: InputSignal<EventEmitter<void>> | EventEmitter<void>,
    selectedPenalty?: Penalty,
    response?: TaskResponses,
  ): MatDialogRef<unknown> {
    return this.dialog.open(RequestReferralPopupComponent, {
      data: {
        offenders: offenders,
        model,
        updateModel,
        selectedPenalty,
        isSingle:
          (offenders.length === 1 && !response) ||
          (response && !model().hasUnlinkedViolations()),
        response,
      },
    });
  }
}
