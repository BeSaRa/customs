import {
  Component,
  computed,
  inject,
  OnInit,
  signal,
  Signal,
} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogClose,
  MatDialogRef,
} from '@angular/material/dialog';
import { LangService } from '@services/lang.service';
import { OnDestroyMixin } from '@mixins/on-destroy-mixin';

import { Investigation } from '@models/investigation';
import {
  filter,
  of,
  shareReplay,
  Subject,
  switchMap,
  takeUntil,
  tap,
} from 'rxjs';
import { ButtonComponent } from '@standalone/components/button/button.component';
import { IconButtonComponent } from '@standalone/components/icon-button/icon-button.component';
import { OffendersViolationsPreviewComponent } from '@standalone/components/offenders-violations-preview/offenders-violations-preview.component';
import { SelectInputComponent } from '@standalone/components/select-input/select-input.component';
import { DecisionMakerComponent } from '@standalone/components/decision-maker/decision-maker.component';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { CustomValidators } from '@validators/custom-validators';
import { Offender } from '@models/offender';
import { Penalty } from '@models/penalty';
import { PenaltyDecisionContract } from '@contracts/penalty-decision-contract';
import { ManagerDecisions } from '@enums/manager-decisions';
import { PenaltyDecision } from '@models/penalty-decision';
import { InvestigationService } from '@services/investigation.service';
import { MatTooltip } from '@angular/material/tooltip';
import { DialogService } from '@services/dialog.service';
import { PenaltyDecisionService } from '@services/penalty-decision.service';
import { DecisionMinutes } from '@models/decision-minutes';

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
  save$: Subject<PenaltyDecision> = new Subject<PenaltyDecision>();
  decisionMinutesList: DecisionMinutes[] = this.data.extras.decisionMinutesList;
  loadPenalties$ = new Subject<void>();
  penaltiesLoaded$ = this.loadPenalties$
    .pipe(filter(() => this.canLoadPenalties()))
    .pipe(switchMap(() => this.loadPenalties()))
    .pipe(takeUntil(this.destroy$))
    .pipe(tap(data => this.penaltyMap.set(data)))
    .pipe(shareReplay(1));

  penaltyMap = signal<
    Record<number, { first: number | null; second: Penalty[] }>
  >({});

  penalties = computed(() => {
    return Object.keys(this.penaltyMap()).reduce<
      Record<string, PenaltyDecisionContract>
    >((acc, offenderId) => {
      if (!acc[offenderId]) {
        acc[offenderId] = {
          managerDecisionControl: this.penaltyMap()[Number(offenderId)].first,
          system: this.penaltyMap()[Number(offenderId)].second.filter(
            p => p.isSystem,
          ),
          normal: this.penaltyMap()[Number(offenderId)].second.filter(
            p => !p.isSystem,
          ),
        };
      }
      return { ...acc };
    }, {});
  });

  offenderControl = new FormControl<Offender | null>(
    null,
    CustomValidators.required,
  );
  ngOnInit(): void {
    this.listenToSave();
    this.listenToLoadPenalties();
    this.loadPenalties$.next();
  }
  hasDecisionMinutes(offenderId: number) {
    return !!this.decisionMinutesList.find(
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
              this.hasDecisionMinutes(
                (this.offenderControl.value as Offender).id,
              ),
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

  private listenToLoadPenalties() {
    this.penaltiesLoaded$.subscribe();
  }
  private canLoadPenalties(): boolean {
    return !!(
      this.model() &&
      this.model().hasTask() && // next 2 conditions to make sure to not run this code for case without task and activityName
      this.model().getActivityName() &&
      this.model().getTaskName()
    );
  }

  private loadPenalties() {
    return this.model()
      ? this.model()
          .getService()
          .getCasePenalty(
            this.model().id as string,
            this.model().getActivityName()!,
          )
      : of(
          {} as Record<string, { first: ManagerDecisions; second: Penalty[] }>,
        );
  }

  listenToSave() {
    this.save$
      .pipe(takeUntil(this.destroy$))
      .pipe(
        switchMap(decision => {
          if (this.hasDecisionMinutes(decision.offenderId)) {
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
