import { Component, computed, inject, OnInit, Signal } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogClose,
  MatDialogRef,
} from '@angular/material/dialog';
import { LangService } from '@services/lang.service';
import { OnDestroyMixin } from '@mixins/on-destroy-mixin';

import { Investigation } from '@models/investigation';
import { filter, of, Subject, switchMap, takeUntil } from 'rxjs';
import { ButtonComponent } from '@standalone/components/button/button.component';
import { IconButtonComponent } from '@standalone/components/icon-button/icon-button.component';
import { OffendersViolationsPreviewComponent } from '@standalone/components/offenders-violations-preview/offenders-violations-preview.component';
import { SelectInputComponent } from '@standalone/components/select-input/select-input.component';
import { DecisionMakerComponent } from '@standalone/components/decision-maker/decision-maker.component';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { CustomValidators } from '@validators/custom-validators';
import { Offender } from '@models/offender';
import { PenaltyDecision } from '@models/penalty-decision';
import { InvestigationService } from '@services/investigation.service';
import { MatTooltip } from '@angular/material/tooltip';
import { DialogService } from '@services/dialog.service';
import { PenaltyDecisionService } from '@services/penalty-decision.service';
import { DecisionMinutes } from '@models/decision-minutes';
import { Penalty } from '@models/penalty';
import { GeneralStatusEnum } from '@enums/general-status-enum';

@Component({
  selector: 'app-meeting-minutes-popup',
  standalone: true,
  imports: [
    ButtonComponent,
    MatDialogClose,
    IconButtonComponent,
    OffendersViolationsPreviewComponent,
    SelectInputComponent,
    DecisionMakerComponent,
    ReactiveFormsModule,
    MatTooltip,
  ],
  templateUrl: './decision-minutes-popup.component.html',
  styleUrl: './decision-minutes-popup.component.scss',
})
export class DecisionMinutesPopupComponent
  extends OnDestroyMixin(class {})
  implements OnInit
{
  data = inject(MAT_DIALOG_DATA);
  lang = inject(LangService);
  dialogRef = inject(MatDialogRef);
  dialog = inject(DialogService);
  investigationService = inject(InvestigationService);
  penaltyDecisionService = inject(PenaltyDecisionService);
  caseId = this.data.extras?.caseId;
  model: Signal<Investigation> = this.data.model as Signal<Investigation>;
  penaltyMap: Signal<
    Record<number, { first: number | null; second: Penalty[] }>
  > = this.data.extras?.penaltyMap as Signal<
    Record<number, { first: number | null; second: Penalty[] }>
  >;
  save$: Subject<PenaltyDecision> = new Subject<PenaltyDecision>();
  decisionMinutesList: DecisionMinutes[] = this.data.extras.decisionMinutesList;

  offenderInfo = computed(() => {
    return this.model().offenderInfo.filter(
      offender => !this.hasDecisionMinutes(offender.id),
    );
  });
  offenderControl = new FormControl<Offender | null>(
    null,
    CustomValidators.required,
  );
  get filteredOffenders() {
    return this.model().offenderInfo.filter(offender =>
      this.model().getConcernedOffendersIds().includes(offender.id),
    );
  }
  ngOnInit(): void {
    this.listenToSave();
  }
  hasDecisionMinutes(offenderId: number) {
    return !!this.getDecisionMinutes(offenderId);
  }
  getDecisionMinutes(offenderId: number) {
    return this.decisionMinutesList.find(
      dm => dm.offenderIds[0] === offenderId,
    );
  }
  openDecisionDialog() {
    of(null)
      .pipe(filter(() => !!this.offenderControl.value))
      .pipe(
        switchMap(() => {
          return this.penaltyDecisionService
            .openDCDecisionDialog(
              this.offenderControl.value as Offender,
              false,
              this.model,
              this.penaltyMap()[(this.offenderControl.value as Offender).id],
            )
            .afterClosed();
        }),
      )
      .subscribe(penaltyDecision => {
        if (penaltyDecision) {
          this.save$.next(penaltyDecision as PenaltyDecision);
        }
      });
  }

  listenToSave() {
    this.save$
      .pipe(takeUntil(this.destroy$))
      .pipe(
        switchMap(decision => {
          if (this.hasDecisionMinutes(decision.offenderId)) {
            if (
              this.getDecisionMinutes(decision.offenderId)?.generalStatus ===
              GeneralStatusEnum.DC_M_LAUNCHED
            ) {
              return this.investigationService.reviewTaskDecision(
                this.model().taskDetails.tkiid,
                decision.id,
                decision.offenderId,
                this.data.isUpdate,
              );
            }
            return of(null);
          } else {
            return this.investigationService.addDisciplinaryDecision(
              decision.id,
            );
          }
        }),
      )
      .subscribe(() => {
        this.dialogRef.close();
      });
  }
  get offender() {
    return this.offenderControl.value as Offender;
  }
}
