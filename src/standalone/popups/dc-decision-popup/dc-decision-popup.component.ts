import { AsyncPipe, DatePipe } from '@angular/common';
import {
  Component,
  computed,
  inject,
  OnInit,
  Signal,
  signal,
} from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogClose,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatRadioButton } from '@angular/material/radio';
import {
  MatOption,
  MatSelect,
  MatSelectTrigger,
} from '@angular/material/select';
import { MatSlideToggle } from '@angular/material/slide-toggle';
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
import { MatTooltip } from '@angular/material/tooltip';
import { ProofTypes } from '@enums/proof-types';
import { UserClick } from '@enums/user-click';
import { OnDestroyMixin } from '@mixins/on-destroy-mixin';
import { Investigation } from '@models/investigation';
import { Offender } from '@models/offender';
import { OffenderViolation } from '@models/offender-violation';
import { Penalty } from '@models/penalty';
import { PenaltyDecision } from '@models/penalty-decision';
import { DialogService } from '@services/dialog.service';
import { EmployeeService } from '@services/employee.service';
import { InvestigationService } from '@services/investigation.service';
import { LangService } from '@services/lang.service';
import { LookupService } from '@services/lookup.service';
import { ToastService } from '@services/toast.service';
import { ButtonComponent } from '@standalone/components/button/button.component';
import { IconButtonComponent } from '@standalone/components/icon-button/icon-button.component';
import { InputComponent } from '@standalone/components/input/input.component';
import { SelectInputComponent } from '@standalone/components/select-input/select-input.component';
import { TextareaComponent } from '@standalone/components/textarea/textarea.component';
import { OptionTemplateDirective } from '@standalone/directives/option-template.directive';
import { CustomValidators } from '@validators/custom-validators';
import { of, Subject, switchMap } from 'rxjs';
import { exhaustMap, filter, map, take, takeUntil, tap } from 'rxjs/operators';

@Component({
  selector: 'app-dc-decision-popup',
  standalone: true,
  imports: [
    ButtonComponent,
    FormsModule,
    IconButtonComponent,
    InputComponent,
    MatDialogClose,
    DatePipe,
    MatTable,
    MatColumnDef,
    MatHeaderCell,
    MatCell,
    MatCellDef,
    MatHeaderCellDef,
    MatHeaderRowDef,
    MatRowDef,
    MatHeaderRow,
    MatRow,
    MatNoDataRow,
    MatSlideToggle,
    MatRadioButton,
    AsyncPipe,
    MatTooltip,
    MatSelect,
    MatOption,
    SelectInputComponent,
    OptionTemplateDirective,
    ReactiveFormsModule,
    TextareaComponent,
    MatSelectTrigger,
  ],
  templateUrl: './dc-decision-popup.component.html',
  styleUrl: './dc-decision-popup.component.scss',
})
export class DcDecisionPopupComponent
  extends OnDestroyMixin(class {})
  implements OnInit
{
  data = inject<{
    offender: Offender;
    isUpdate: boolean;
    model: Signal<Investigation>;
    offenderPenalties: { first: number; second: Penalty[] };
    isView?: boolean;
    isPenaltyModification?: boolean;
  }>(MAT_DIALOG_DATA);
  dialogRef = inject(MatDialogRef);
  lang = inject(LangService);
  toast = inject(ToastService);
  lookupService = inject(LookupService);
  save$ = new Subject<void>();
  employeeService = inject(EmployeeService);
  dialog = inject(DialogService);
  investigationService = inject(InvestigationService);
  offender = computed(() => {
    return this.data.offender;
  });
  model = computed(() => {
    return this.data.model();
  });
  offenderViolations = computed(() => {
    return this.model().offenderViolationInfo.filter(item => {
      return item.offenderId === this.offender().id;
    });
  });
  proofStatus = signal(
    this.lookupService.lookups.proofStatus
      .slice()
      .sort((a, b) => a.lookupKey - b.lookupKey),
  );
  controls = computed<{ [key: number]: FormControl<ProofTypes> }>(() => {
    return this.offenderViolations().reduce((previousValue, currentValue) => {
      return {
        ...previousValue,
        [currentValue.id]: new FormControl(currentValue.proofStatus),
      };
    }, {});
  });

  offenderViolationsMap = computed(() => {
    return this.model().offenderViolationInfo.reduce<
      Record<number, OffenderViolation[]>
    >((acc, current) => {
      if (!Object.prototype.hasOwnProperty.call(acc, current.offenderId)) {
        acc[current.offenderId] = [];
      }
      acc[current.offenderId] = [...acc[current.offenderId], current];
      return { ...acc };
    }, {});
  });
  violationProofStatus = computed(() => {
    return Object.entries(this.offenderViolationsMap()).reduce<
      Record<number, FormControl<number | null>[]>
    >((acc, [key, offenderViolation]) => {
      acc[Number(key)] = offenderViolation.map(
        i =>
          new FormControl<number>({
            value: i.proofStatus,
            disabled: !this.model().hasTask() || !this.model().inMyInbox(),
          }),
      );
      return acc;
    }, {});
  });
  decisionMap = computed(() => {
    return this.model().penaltyDecisions.reduce<
      Record<number, PenaltyDecision>
    >((acc, item) => {
      return { ...acc, [item.offenderId]: item };
    }, {});
  });

  oldPenaltyDecision = computed(() => {
    return this.model().getPenaltyDecisionByOffenderId(this.offender().id);
  });
  oldPenaltyId = computed(() => {
    return (
      this.penalties().find(p => p.id === this.oldPenaltyDecision()?.penaltyId)
        ?.id ?? null
    );
  });
  oldPenaltyComment = computed(() => {
    return this.oldPenaltyDecision()?.comment;
  });
  offenderPenalties = signal(this.data.offenderPenalties);
  isPenaltyModification = signal(this.data.isPenaltyModification);

  penalties = computed(() => {
    return this.offenderPenalties().second;
  });
  penaltiesMap = computed<Record<number, Penalty>>(() => {
    return this.offenderPenalties().second.reduce((acc, item) => {
      return { ...acc, [item.id]: item };
    }, {});
  });
  penaltyControl = new FormControl<number | null>(this.oldPenaltyId()!, {
    nonNullable: false,
    validators: [CustomValidators.required],
  });
  textControl: FormControl = new FormControl<string>(
    this.oldPenaltyComment()!,
    {
      validators: [
        CustomValidators.required,
        CustomValidators.maxLength(10000),
      ],
    },
  );
  displayedColumns = ['violation', 'createdOn', 'proofStatus'];

  assertType(element: unknown): OffenderViolation {
    return element as OffenderViolation;
  }

  ngOnInit(): void {
    this.listenToSave();
    if (this.isView()) {
      Object.keys(this.controls()).forEach(key =>
        this.controls()[key as unknown as number].disable(),
      );
      this.penaltyControl.disable();
      this.textControl.disable();
    }
  }

  focusOnSelect(select: MatSelect) {
    select.focus();
    select.toggle();
  }

  private displayConfirmMessage(penaltyDecision: null | PenaltyDecision) {
    return penaltyDecision
      ? this.dialog
          .confirm(this.lang.map.action_will_effect_current_offender_decision)
          .afterClosed()
          .pipe(
            map(click => {
              return { click, penaltyDecision };
            }),
          )
      : of({ click: UserClick.YES, penaltyDecision });
  }

  private resetProofStatusToOldValue(
    click: UserClick | undefined,
    item: OffenderViolation,
    index: number,
    oldValue: number,
  ) {
    if (click !== UserClick.YES) {
      this.violationProofStatus()[item.offenderId][index].patchValue(oldValue, {
        emitEvent: false,
      });
    }
  }

  proofStatusChanged(item: OffenderViolation, index: number) {
    const oldValue = this.violationProofStatus()[item.offenderId][index].value!;
    of(this.decisionMap()[item.offenderId])
      .pipe(takeUntil(this.destroy$))
      .pipe(
        switchMap(penaltyDecision =>
          this.displayConfirmMessage(penaltyDecision),
        ),
        tap(({ click }) => {
          this.resetProofStatusToOldValue(click, item, index, oldValue);
        }),
      )
      .subscribe(() => {
        this.updateOffenderViolationProofStatus(item);
      });
  }
  updateOffenderViolationProofStatus(item: OffenderViolation) {
    Promise.resolve().then(() => {
      item.proofStatus = this.controls()[item.id].value;
      const violationIndex = this.model().offenderViolationInfo.findIndex(i => {
        return i === item;
      });
      item
        .save()
        .pipe(takeUntil(this.destroy$), take(1))
        .subscribe(model => {
          this.model().offenderViolationInfo.splice(violationIndex, 1, model);
          this.toast.success(
            this.lang.map.is_proved_status_updated_successfully,
          );
        });
    });
  }
  private prepareModel(): PenaltyDecision {
    return new PenaltyDecision().clone<PenaltyDecision>({
      ...(this.oldPenaltyDecision() ? this.oldPenaltyDecision() : undefined),
      caseId: this.model().id,
      offenderId: this.offender().id,
      signerId: this.employeeService.getEmployee()?.id,
      penaltyId: this.penaltyControl.value!,
      comment: this.textControl.value,
      status: 1,
      penaltyInfo: this.penaltiesMap()[this.penaltyControl.value!],
      tkiid: this.isPenaltyModification() ? null : this.model().getTaskId(),
      roleAuthName: this.isPenaltyModification()
        ? 'Penalty Modification'
        : this.model().getTeamDisplayName(),
    });
  }

  private listenToSave() {
    this.save$
      .pipe(takeUntil(this.destroy$))
      .pipe(map(() => this.penaltyControl.valid && this.textControl.valid))
      .pipe(
        tap(
          valid =>
            !valid &&
            this.dialog.error(
              this.lang.map.msg_make_sure_all_required_fields_are_filled,
            ),
        ),
        filter(valid => {
          return valid;
        }),
      )
      .pipe(
        map(() => {
          return this.prepareModel();
        }),
      )
      .pipe(
        exhaustMap(model => {
          if (this.data.isUpdate) {
            model.isUpdate = true;
            return model.save().pipe(
              map(saved => {
                return new PenaltyDecision().clone<PenaltyDecision>({
                  ...model,
                  id: saved.id,
                });
              }),
            );
          } else {
            return model.create().pipe(
              map(saved => {
                return new PenaltyDecision().clone<PenaltyDecision>({
                  ...model,
                  id: saved.id,
                });
              }),
            );
          }
        }),
      )
      .pipe(
        tap(model => {
          this.model().removePenaltyDecision(this.oldPenaltyDecision());
          this.model().appendPenaltyDecision(model);
        }),
      )
      .subscribe(model => {
        this.toast.success(this.lang.map.the_penalty_saved_successfully);
        this.dialogRef.close(model);
      });
  }

  selectedPenaltyText(value: number | null) {
    return this.penaltiesMap()[value as unknown as number]
      ? this.penaltiesMap()[value as unknown as number].getNames()
      : '';
  }

  isView() {
    return this.data.isView ?? false;
  }
}
