import { CommonModule } from '@angular/common';
import {
  Component,
  computed,
  EventEmitter,
  inject,
  InputSignal,
  OnInit,
  signal,
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatOption } from '@angular/material/autocomplete';
import {
  MAT_DIALOG_DATA,
  MatDialogClose,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { MatSelect } from '@angular/material/select';
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
import { OffenderInvStatus } from '@enums/offender-inv-status';
import { OperationType } from '@enums/operation-type';
import { ProofTypes } from '@enums/proof-types';
import { SystemPenalties } from '@enums/system-penalties';
import { TaskResponses } from '@enums/task-responses';
import { OnDestroyMixin } from '@mixins/on-destroy-mixin';
import { Investigation } from '@models/investigation';
import { Memorandum } from '@models/memorandum';
import { Offender } from '@models/offender';
import { OffenderViolation } from '@models/offender-violation';
import { Penalty } from '@models/penalty';
import { PenaltyDecision } from '@models/penalty-decision';
import { DialogService } from '@services/dialog.service';
import { EmployeeService } from '@services/employee.service';
import { InvestigationService } from '@services/investigation.service';
import { LangService } from '@services/lang.service';
import { LookupService } from '@services/lookup.service';
import { OffenderViolationService } from '@services/offender-violation.service';
import { OffenderService } from '@services/offender.service';
import { PenaltyDecisionService } from '@services/penalty-decision.service';
import { PenaltyService } from '@services/penalty.service';
import { ToastService } from '@services/toast.service';
import { ButtonComponent } from '@standalone/components/button/button.component';
import { IconButtonComponent } from '@standalone/components/icon-button/icon-button.component';
import { SelectInputComponent } from '@standalone/components/select-input/select-input.component';
import { TextareaComponent } from '@standalone/components/textarea/textarea.component';
import { ignoreErrors } from '@utils/utils';
import { CustomValidators } from '@validators/custom-validators';
import { filter, of, Subject, tap } from 'rxjs';
import { map, switchMap, takeUntil } from 'rxjs/operators';

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
    MatOption,
    MatSelect,
    MatMenu,
    MatMenuItem,
    MatMenuTrigger,
    CommonModule,
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
    response?: TaskResponses;
  }>(MAT_DIALOG_DATA);
  lang = inject(LangService);
  dialogRef = inject(MatDialogRef);
  offenderService = inject(OffenderService);
  offenderViolationService = inject(OffenderViolationService);
  penaltyService = inject(PenaltyService);
  penaltyDecisionService = inject(PenaltyDecisionService);
  investigationService = inject(InvestigationService);
  lookupService = inject(LookupService);
  dialog = inject(DialogService);

  //TODO: only display attended or not attended
  offenderInvStatus = this.lookupService.lookups.offenderStatus.filter(
    o =>
      o.lookupKey === OffenderInvStatus.INVESTIGATION_DONE ||
      o.lookupKey === OffenderInvStatus.INVESTIGATION_POSTPONED,
  );
  proofStatus = this.lookupService.lookups.proofStatus;
  violationEffect = this.lookupService.lookups.customsViolationEffect
    .slice()
    .sort((a, b) => a.lookupKey - b.lookupKey);
  offenderInvStatusControls: Record<number, FormControl> = {};
  violationEffectControls: Record<number, FormControl> = {};
  controls: Record<number, FormControl> = {};
  investigationModel = signal(this.data.investigationModel);
  operation = signal(this.data.operation);
  model = signal(this.data.model);

  offenders = computed(() => {
    const _offenders = this.investigationModel().getConcernedOffenders();
    this.offenderInvStatusControls = _offenders.reduce(
      (acc, cur) => {
        acc[cur.id] = new FormControl(cur.status);
        return acc;
      },
      {} as Record<number, FormControl>,
    );
    this.violationEffectControls = _offenders.reduce(
      (acc, cur) => {
        acc[cur.id] = new FormControl(cur.customsViolationEffect);
        return acc;
      },
      {} as Record<number, FormControl>,
    );
    return _offenders;
  });
  offendersIds = computed(() => this.offenders().map(i => i.id));
  updateModel = this.data.updateModel;
  offenderViolationsMap = computed<Record<number, OffenderViolation[]>>(() => {
    return this.investigationModel()
      .offenderViolationInfo.filter(offenderViolation =>
        this.offendersIds().includes(offenderViolation.offenderId),
      )
      .reduce(
        (acc, item) => {
          acc[item.offenderId] = (acc[item.offenderId] || []).concat(item);
          this.controls[item.id] = new FormControl(item.proofStatus);
          return acc;
        },
        {} as Record<number, OffenderViolation[]>,
      );
  });
  penaltiesDecisionsMap = this.investigationModel().penaltyDecisions.reduce(
    (acc, item) => {
      return this.offendersIds().includes(item.offenderId)
        ? { ...acc, [item.offenderId]: item }
        : { ...acc };
    },
    {} as Record<number, PenaltyDecision>,
  );
  penaltiesMap: Record<number, { first: number; second: Penalty[] }> = {};
  // create only
  save$: Subject<void> = new Subject();
  // create and approve
  saveAndCreate$: Subject<void> = new Subject();
  offenderInvStatus$ = new Subject<Offender>();
  takeDecision$ = new Subject<{ offender: Offender; decision: Penalty }>();

  loadPenalties$ = new Subject<void>();

  textControl = new FormControl(this.model().note, [CustomValidators.required]);

  employee = inject(EmployeeService).getEmployee();

  readonly OffenderInvStatus = OffenderInvStatus;

  displayedColumns: string[] = [
    'offenderName',
    'offenderInvStatus',
    'violations',
    'investigationResult',
    'violationEffect',
    'recommendation',
  ];
  private employeeService = inject(EmployeeService);
  private toast = inject(ToastService);

  assertType(item: unknown): Offender {
    return item as Offender;
  }

  assertNumber(event: unknown): number {
    return event as number;
  }

  ngOnInit(): void {
    this.listenToSave();
    this.listenToSaveAndCreate();
    this.listenToOffenderInvStatus();
    this.listenToTakeDecision();
    this.listenToLoadPenalties();
    this.loadPenalties$.next();
    setTimeout(() => {
      this.offenders().forEach(o => this.checkInvStatus(o));
    }, 0);
  }

  private listenToSave() {
    this.save$
      .pipe(takeUntil(this.destroy$))
      .pipe(
        tap(
          () =>
            this.textControl.invalid &&
            this.dialog.error(
              this.lang.map.msg_make_sure_all_required_fields_are_filled,
            ),
        ),
        filter(() => this.textControl.valid),
      )
      .pipe(this.saveOperation())
      .pipe(
        switchMap(model =>
          this.data.response ? this.completeTask(model) : of(model),
        ),
      )
      .subscribe(model => {
        this.updateModel().emit();
        this.model.set(model);
        this.dialogRef.close(this.data.response);
      });
  }

  get saveDisabled() {
    for (const offender of this.offenders()) {
      const offenderPenaltyId =
        this.penaltiesDecisionsMap[offender.id]?.penaltyId;
      if (!offenderPenaltyId) return true;

      const hasPenalty = this.offenderPenalties(offender.id).some(
        penalty => penalty.id === offenderPenaltyId,
      );
      if (
        !hasPenalty &&
        this.offenderInvStatusControls[offender.id].value !==
          OffenderInvStatus.INVESTIGATION_POSTPONED
      )
        return true;
    }

    if (
      Object.values(this.offenderInvStatusControls).some(
        c =>
          c.value !== OffenderInvStatus.INVESTIGATION_DONE &&
          c.value !== OffenderInvStatus.INVESTIGATION_POSTPONED,
      )
    ) {
      return true;
    }

    const _offendersIDs = Object.keys(this.offenderInvStatusControls).filter(
      o =>
        this.offenderInvStatusControls[o as unknown as number].value !==
        OffenderInvStatus.INVESTIGATION_POSTPONED,
    );

    const _offendersViolationsIds = Object.keys(this.offenderViolationsMap())
      .filter(key => _offendersIDs.includes(key))
      .flatMap(cur =>
        this.offenderViolationsMap()[cur as unknown as number].map(ov => ov.id),
      );

    return Object.keys(this.controls).some(
      key =>
        _offendersViolationsIds.includes(parseInt(key)) &&
        this.controls[key as unknown as number].value === ProofTypes.UNDEFINED,
    );
  }

  private completeTask(model: Memorandum) {
    return of(this.investigationModel().getService())
      .pipe(
        switchMap(service => {
          const decisionsNeedUpdates = Object.values(
            this.penaltiesDecisionsMap,
          ).filter(item => {
            return item.signerId !== this.employee!.id;
          });
          return decisionsNeedUpdates.length
            ? this.penaltyDecisionService
                .createBulkFull(
                  decisionsNeedUpdates.map(item => {
                    return item.clone<PenaltyDecision>({
                      ...item,
                      signerId: this.employee!.id,
                      tkiid: this.investigationModel().getTaskId(),
                      roleAuthName:
                        this.investigationModel().getTeamDisplayName(),
                    });
                  }),
                )
                .pipe(map(() => service))
            : of(service);
        }),
        switchMap(service => {
          return service
            .completeTask(this.investigationModel().getTaskId()!, {
              selectedResponse: this.data.response!,
            })
            .pipe(ignoreErrors());
        }),
      )
      .pipe(
        tap(() => {
          this.toast.success(
            this.lang.map.msg_x_performed_successfully.change({
              x: this.lang.map.final_complete,
            }),
          );
        }),
      )
      .pipe(map(() => model));
  }

  private saveOperation() {
    return switchMap(() => {
      return this.operation() === OperationType.CREATE
        ? this.investigationService
            .createMemorandum(
              this.model().clone<Memorandum>({
                note: this.textControl.value!,
                isLegal: true,
                offenderIds: this.offendersIds(),
                offenderType:
                  this.investigationModel().getConcernedOffendersType(),
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

  private listenToOffenderInvStatus() {
    this.offenderInvStatus$
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
              penaltyId: decision.id,
              status: 1,
              tkiid: this.investigationModel().getTaskId(),
              roleAuthName: this.investigationModel().getTeamDisplayName(),
            })
            .create()
            .pipe(
              map(item =>
                item.clone<PenaltyDecision>({
                  penaltyInfo: decision,
                }),
              ),
            );
        }),
      )
      .subscribe(updated => {
        this.penaltiesDecisionsMap[updated.offenderId] = updated;
        this.investigationModel().replaceDecisionBasedOnOffenderId(updated);
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

  updateOffenderInvStatus(offender: Offender, status: unknown) {
    offender.status = status as number;
    offender.update().subscribe(() => {
      this.checkInvStatus(offender);
      if (status === OffenderInvStatus.INVESTIGATION_POSTPONED) {
        this.revertPenaltyAndProofStatus(offender);
      }
    });
  }

  updateOffenderViolationEffect(offender: Offender, violationEffect: unknown) {
    offender.customsViolationEffect = violationEffect as number;
    offender.update().subscribe(() => {
      this.loadPenalties$.next();
    });
  }

  checkInvStatus = (offender: Offender) => {
    this.investigationModel()
      .offenderViolationInfo.filter(
        offenderViolation => offenderViolation.offenderId === offender.id,
      )
      .forEach(ov => {
        offender.status === OffenderInvStatus.INVESTIGATION_DONE
          ? this.controls[ov.id]?.enable()
          : this.controls[ov.id]?.disable();
      });

    offender.status === OffenderInvStatus.INVESTIGATION_DONE
      ? this.violationEffectControls[offender.id]?.enable()
      : this.violationEffectControls[offender.id]?.disable();
  };

  revertPenaltyAndProofStatus(offender: Offender) {
    let _penalty: Penalty | undefined;
    this.penaltyService
      .loadAsLookups()
      .pipe(
        switchMap(penalties => {
          _penalty = penalties.find(
            p => p.penaltyKey === SystemPenalties.REFERRAL_TO_LEGAL_AFFAIRS,
          );
          if (
            this.penaltiesDecisionsMap[offender.id].penaltyId === _penalty?.id
          ) {
            return of(this.penaltiesDecisionsMap[offender.id]);
          } else {
            return this.penaltyDecisionService.updateFull({
              ...this.penaltiesDecisionsMap[offender.id],
              penaltyId:
                _penalty?.id ??
                this.penaltiesDecisionsMap[offender.id].penaltyId,
            } as PenaltyDecision);
          }
        }),
      )
      .subscribe(d => {
        this.penaltiesDecisionsMap[offender.id] = d;
        this.penaltiesDecisionsMap[offender.id].penaltyInfo =
          _penalty ?? this.penaltiesDecisionsMap[offender.id].penaltyInfo;
      });

    const _revertedOffenderViolationsProof: OffenderViolation[] = [];
    this.offenderViolationsMap()[offender.id].forEach(ov => {
      if (this.controls[ov.id].value !== ProofTypes.UNDEFINED) {
        ov.proofStatus = ProofTypes.UNDEFINED;
        _revertedOffenderViolationsProof.push(ov);
        this.controls[ov.id].setValue(ProofTypes.UNDEFINED, {
          emitEvent: false,
        });
      }
    });
    if (_revertedOffenderViolationsProof.length) {
      this.offenderViolationService
        .updateBulk(_revertedOffenderViolationsProof)
        .subscribe(() => {});
    }
  }

  private listenToLoadPenalties() {
    this.loadPenalties$
      .pipe(
        switchMap(() => {
          return this.investigationModel().loadPenalties().pipe(ignoreErrors());
        }),
      )
      .subscribe(value => {
        this.penaltiesMap = value;
      });
  }

  assertTypePenalty($event: unknown): Penalty {
    return $event as Penalty;
  }

  offenderPenalties(offenderId: number): Penalty[] {
    return (this.penaltiesMap[offenderId] || { second: [] }).second;
  }

  isSelectedPenalty(penalty: Penalty, element: Offender) {
    return (
      this.penaltiesDecisionsMap[element.id] &&
      this.penaltiesDecisionsMap[element.id].penaltyId === penalty.id
    );
  }

  isBrokersTask() {
    return this.investigationModel().isBrokerTask();
  }
}
