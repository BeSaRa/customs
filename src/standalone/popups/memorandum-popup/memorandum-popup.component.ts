import {
  Component,
  computed,
  EventEmitter,
  inject,
  InputSignal,
  OnInit,
  signal,
} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogClose,
  MatDialogRef,
} from '@angular/material/dialog';
import { Investigation } from '@models/investigation';
import { Memorandum } from '@models/memorandum';
import { OperationType } from '@enums/operation-type';
import { OffenderService } from '@services/offender.service';
import { PenaltyDecisionService } from '@services/penalty-decision.service';
import { InvestigationService } from '@services/investigation.service';
import { OnDestroyMixin } from '@mixins/on-destroy-mixin';
import { IconButtonComponent } from '@standalone/components/icon-button/icon-button.component';
import { LangService } from '@services/lang.service';
import { Subject } from 'rxjs';
import { ButtonComponent } from '@standalone/components/button/button.component';
import { OffenderViolation } from '@models/offender-violation';
import { map, switchMap, takeUntil } from 'rxjs/operators';
import { ignoreErrors } from '@utils/utils';
import { Offender } from '@models/offender';
import { Penalty } from '@models/penalty';
import { LookupService } from '@services/lookup.service';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatNoDataRow,
  MatRow,
  MatRowDef,
  MatTable,
} from '@angular/material/table';
import { SelectInputComponent } from '@standalone/components/select-input/select-input.component';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { TextareaComponent } from '@standalone/components/textarea/textarea.component';
import { PenaltyDecision } from '@models/penalty-decision';
import { EmployeeService } from '@services/employee.service';

@Component({
  selector: 'app-memorandum-popup',
  standalone: true,
  imports: [
    IconButtonComponent,
    MatDialogClose,
    ButtonComponent,
    MatTable,
    MatColumnDef,
    MatHeaderCell,
    MatCellDef,
    MatCell,
    MatHeaderCellDef,
    MatHeaderRow,
    MatRow,
    MatRowDef,
    MatHeaderRowDef,
    MatNoDataRow,
    SelectInputComponent,
    ReactiveFormsModule,
    TextareaComponent,
  ],
  templateUrl: './memorandum-popup.component.html',
  styleUrl: './memorandum-popup.component.scss',
})
export class MemorandumPopupComponent
  extends OnDestroyMixin(class {})
  implements OnInit
{
  data = inject<{
    investigationModel: Investigation;
    model: Memorandum;
    operation: OperationType;
    updateModel: InputSignal<EventEmitter<void>>;
  }>(MAT_DIALOG_DATA);
  lang = inject(LangService);
  dialogRef = inject(MatDialogRef);
  offenderService = inject(OffenderService);
  penaltyDecisionService = inject(PenaltyDecisionService);
  investigationService = inject(InvestigationService);
  lookupService = inject(LookupService);
  //TODO: only display attended or not attended
  offenderStatus = this.lookupService.lookups.offenderStatus;
  proofStatus = this.lookupService.lookups.proofStatus;
  controls: Record<number, FormControl> = {};
  investigationModel = signal(this.data.investigationModel);
  decisionControls: Record<number, FormControl> = this.investigationModel()
    .getConcernedOffenders()
    .reduce(
      (acc, item) => {
        return {
          ...acc,
          [item.id]: new FormControl(
            this.investigationModel().getPenaltyDecisionByOffenderId(
              item.id,
            )?.penaltyId,
          ),
        };
      },
      {} as Record<number, FormControl>,
    );

  operation = signal(this.data.operation);
  model = signal(this.data.model);
  offenders = computed(() => this.investigationModel().getConcernedOffenders());
  offendersIds = computed(() => {
    return this.offenders().map(item => {
      const decision = this.investigationModel().getPenaltyDecisionByOffenderId(
        item.id,
      );

      this.decisionControls[item.id] = new FormControl(decision?.penaltyId);
      return item.id;
    });
  });
  updateModel = this.data.updateModel;
  offenderViolationsMap = computed<Record<number, OffenderViolation[]>>(() => {
    return this.investigationModel().offenderViolationInfo.reduce(
      (acc, item) => {
        acc[item.offenderId] = (acc[item.offenderId] || []).concat(item);
        this.controls[item.id] = new FormControl(item.proofStatus);
        return acc;
      },
      {} as Record<number, OffenderViolation[]>,
    );
  });

  penaltiesMap: Record<number, { first: number; second: Penalty[] }> = {};

  penaltiesIdsMap: Record<number, Penalty> = {};
  // create only
  save$: Subject<void> = new Subject();
  // create and approve
  saveAndCreate$: Subject<void> = new Subject();
  offenderStatus$ = new Subject<Offender>();
  takeDecision$ = new Subject<{ offender: Offender; decision: number }>();

  loadPenalties$ = new Subject<void>();

  textControl = new FormControl(this.model().note);

  displayedColumns: string[] = [
    'offenderName',
    'violations',
    'investigationResult',
    'recommendation',
  ];
  private employeeService = inject(EmployeeService);

  assertType(item: unknown): Offender {
    return item as Offender;
  }

  assertNumber(event: unknown): number {
    return event as number;
  }

  ngOnInit(): void {
    this.listenToSave();
    this.listenToSaveAndCreate();
    this.listenToOffenderStatus();
    this.listenToTakeDecision();
    this.listenToLoadPenalties();
    this.loadPenalties$.next();
  }

  private listenToSave() {
    this.save$
      .pipe(takeUntil(this.destroy$))
      .pipe(this.saveOperation())
      .subscribe(model => {
        this.model.set(model);
        this.dialogRef.close();
      });
  }

  private saveOperation() {
    return switchMap(() => {
      return this.operation() === OperationType.CREATE
        ? this.investigationService
            .createMemorandum(
              this.model().clone<Memorandum>({
                note: this.textControl.value!,
                offenderIds: this.offendersIds(),
                category: 11,
                decisionFullSerial:
                  this.investigationModel().getReferralNumber(),
              }),
            )
            .pipe(ignoreErrors())
        : this.investigationService
            .updateMemorandum(
              this.model().clone<Memorandum>({
                note: this.textControl.value!,
                offenderIds: this.offendersIds(),
                category: 11,
                decisionFullSerial:
                  this.investigationModel().getReferralNumber(),
              }),
            )
            .pipe(ignoreErrors());
    });
  }

  private listenToSaveAndCreate() {
    this.saveAndCreate$
      .pipe(takeUntil(this.destroy$))
      .pipe(
        this.saveOperation(),
        switchMap(model => {
          this.model.set(model);
          return this.investigationService
            .approveMemorandum(model.id)
            .pipe(ignoreErrors());
        }),
      )
      .subscribe(() => {
        this.dialogRef.close();
      });
  }

  private listenToOffenderStatus() {
    this.offenderStatus$
      .pipe(takeUntil(this.destroy$))
      .pipe(
        switchMap(offender => {
          return offender.save().pipe(ignoreErrors());
        }),
      )
      .subscribe(_offender => {
        // replace offender here
      });
  }

  private listenToTakeDecision() {
    this.takeDecision$
      .pipe(takeUntil(this.destroy$))
      .pipe(
        switchMap(({ offender, decision }) => {
          return new PenaltyDecision()
            .clone<PenaltyDecision>({
              caseId: this.investigationModel().id,
              offenderId: offender.id,
              signerId: this.employeeService.getEmployee()?.id,
              penaltyId: decision,
              status: 1,
              tkiid: this.investigationModel().getTaskId(),
            })
            .create()
            .pipe(
              map(item =>
                item.clone<PenaltyDecision>({
                  penaltyInfo: this.penaltiesIdsMap[decision],
                }),
              ),
            );
        }),
      )
      .subscribe(updated => {
        this.investigationModel().replaceDecisionBasedOnOffenderId(updated);
        this.updateModel().emit();
      });
  }

  updateProof(item: OffenderViolation) {
    Promise.resolve().then(() => {
      item.proofStatus = this.controls[item.id].value;
      item
        .update()
        .pipe(takeUntil(this.destroy$))
        .subscribe(() => {
          this.loadPenalties$.next();
          //TODO  update model for offenderViolations
        });
    });
  }

  private listenToLoadPenalties() {
    this.loadPenalties$
      .pipe(
        switchMap(() => {
          return this.investigationModel().loadPenalties().pipe(ignoreErrors());
        }),
      )
      .subscribe(value => {
        // don't refactor this code. I made it like that for purpose
        this.penaltiesMap = value;
        const penalties = Object.keys(value)
          .map(item => {
            return value[item].second;
          })
          .flat();
        const penaltiesIds: number[] = [];

        for (let i = 0; i < penalties.length; i++) {
          if (penaltiesIds[penalties[i].id]) {
            continue;
          }
          penaltiesIds.push(penalties[i].id);
          this.penaltiesIdsMap[penalties[i].id] = penalties[i];
        }
      });
  }

  assertTypePenalty($event: unknown): Penalty {
    return $event as Penalty;
  }
}
