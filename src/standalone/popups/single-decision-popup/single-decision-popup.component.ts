import { AsyncPipe, DatePipe } from '@angular/common';
import {
  Component,
  computed,
  EventEmitter,
  inject,
  InputSignal,
  OnInit,
  signal,
} from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogClose,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatRadioButton, MatRadioGroup } from '@angular/material/radio';
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
import { Config } from '@constants/config';
import { CustomsViolationEffect } from '@enums/customs-violation-effect';
import { ManagerDecisions } from '@enums/manager-decisions';
import { OffenderTypes } from '@enums/offender-types';
import { ResponsibilityRepeatViolations } from '@enums/responsibility-repeat-violations';
import { OnDestroyMixin } from '@mixins/on-destroy-mixin';
import { Investigation } from '@models/investigation';
import { Lookup } from '@models/lookup';
import { Offender } from '@models/offender';
import { OffenderViolation } from '@models/offender-violation';
import { Penalty } from '@models/penalty';
import { PenaltyDecision } from '@models/penalty-decision';
import { DialogService } from '@services/dialog.service';
import { EmployeeService } from '@services/employee.service';
import { LangService } from '@services/lang.service';
import { LookupService } from '@services/lookup.service';
import { OffenderViolationService } from '@services/offender-violation.service';
import { ToastService } from '@services/toast.service';
import { ButtonComponent } from '@standalone/components/button/button.component';
import { IconButtonComponent } from '@standalone/components/icon-button/icon-button.component';
import { InputComponent } from '@standalone/components/input/input.component';
import { SelectInputComponent } from '@standalone/components/select-input/select-input.component';
import { TextareaComponent } from '@standalone/components/textarea/textarea.component';
import { OptionTemplateDirective } from '@standalone/directives/option-template.directive';
import { CustomValidators } from '@validators/custom-validators';
import { of, Subject } from 'rxjs';
import {
  catchError,
  exhaustMap,
  filter,
  map,
  switchMap,
  takeUntil,
  tap,
} from 'rxjs/operators';

@Component({
  selector: 'app-single-decision-popup',
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
    MatRadioGroup,
  ],
  templateUrl: './single-decision-popup.component.html',
  styleUrl: './single-decision-popup.component.scss',
})
export class SingleDecisionPopupComponent
  extends OnDestroyMixin(class {})
  implements OnInit
{
  data = inject<{
    offender: Offender;
    model: InputSignal<Investigation>;
    updateModel: InputSignal<EventEmitter<void>>;
    offenderPenalties: { first: number; second: Penalty[] };
  }>(MAT_DIALOG_DATA);
  dialogRef = inject(MatDialogRef);
  lang = inject(LangService);
  toast = inject(ToastService);
  lookupService = inject(LookupService);
  save$ = new Subject<void>();
  employeeService = inject(EmployeeService);
  dialog = inject(DialogService);
  offenderViolationService = inject(OffenderViolationService);
  offender = signal(this.data.offender);

  todayDate = new Date();

  isBroker = computed(() => {
    return this.offender().type === OffenderTypes.BROKER;
  });

  model = this.data.model;
  offenderViolations = this.model().offenderViolationInfo.filter(item => {
    return item.offenderId === this.offender().id;
  });

  proofStatus = signal(
    this.lookupService.lookups.proofStatus
      .slice()
      .sort((a, b) => a.lookupKey - b.lookupKey),
  );
  proofStatusMap = computed(() => {
    return this.proofStatus().reduce<Record<number, Lookup>>((acc, current) => {
      return { ...acc, [current.lookupKey]: current };
    }, {});
  });
  controls = computed(() => {
    return this.offenderViolations.map(item => {
      return new FormControl(item.proofStatus);
    });
  });
  updateModel = this.data.updateModel;
  oldPenaltyDecision = computed(() => {
    return this.model().getPenaltyDecisionByOffenderId(this.offender().id);
  });
  oldPenaltyId = computed(() => {
    return this.oldPenaltyDecision()?.penaltyId;
  });
  oldPenaltyComment = computed(() => {
    return this.oldPenaltyDecision()?.comment;
  });
  offenderPenalties = signal(this.data.offenderPenalties);
  penalties = computed(() => {
    return this.offenderPenalties().second.filter(item => !item.isSystem);
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

  violationEffect = this.lookupService.lookups.customsViolationEffect
    .slice()
    .sort((a, b) => a.lookupKey - b.lookupKey);

  violationEffectControl: FormControl = new FormControl(
    this.offender().customsViolationEffect,
  );

  ResponsibilityRepeatViolations =
    this.lookupService.lookups.responsibilityRepeatViolations
      .slice()
      .sort((a, b) => a.lookupKey - b.lookupKey);

  responsibilityRepeatViolationsControl: FormControl = new FormControl(
    this.offenderViolations[0].responsibilityRepeatViolations ??
      this.getFilteredResponsibilityRepeatViolations()[0].lookupKey,
  );

  getFilteredResponsibilityRepeatViolations() {
    return this.ResponsibilityRepeatViolations.filter(r => {
      if (this.violationEffectControl.value === CustomsViolationEffect.BROKER)
        return r.lookupKey !== ResponsibilityRepeatViolations.AGENCY;
      else return r.lookupKey !== ResponsibilityRepeatViolations.BROKER;
    });
  }

  listenToViolationEffect() {
    this.violationEffectControl.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.responsibilityRepeatViolationsControl.setValue(
          this.getFilteredResponsibilityRepeatViolations()[0].lookupKey,
        );
        this.updateOffenderViolationEffect();
        this.penaltyControl.setValue(null);
      });
  }

  listenToResponsibilityRepeatViolations() {
    this.responsibilityRepeatViolationsControl.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(value => {
        this.offenderViolations.forEach(
          ov => (ov.responsibilityRepeatViolations = value),
        );
        this.offenderViolationService
          .updateBulk(this.offenderViolations)
          .subscribe(_ => {});
      });
  }

  assertType(element: unknown): OffenderViolation {
    return element as OffenderViolation;
  }

  ngOnInit(): void {
    this.listenToSave();
    this.listenToResponsibilityRepeatViolations();
    this.listenToViolationEffect();
  }

  updateOffenderViolationEffect() {
    this.offender.update(o => {
      o.customsViolationEffect = this.violationEffectControl.value;
      return o;
    });
    this.offender()
      .update()
      .pipe(switchMap(() => this.loadPenalties()))
      .subscribe(penalties => {
        this.offenderPenalties.set(penalties[this.offender().id]);
      });
  }

  private loadPenalties() {
    return this.model()
      .getService()
      .getCasePenalty(
        this.model().id as string,
        this.model().getActivityName()!,
      )
      .pipe(
        catchError(() => {
          return of(
            {} as Record<
              string,
              { first: ManagerDecisions; second: Penalty[] }
            >,
          );
        }),
      );
  }

  focusOnSelect(select: MatSelect) {
    select.focus();
    select.toggle();
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
      ...(this.isBroker()
        ? { customsViolationEffect: this.violationEffectControl.value }
        : null),
      penaltyInfo: this.penaltiesMap()[this.penaltyControl.value!],
      tkiid: this.model().getTaskId(),
      roleAuthName: this.model().getTeamDisplayName(),
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
          return model.create().pipe(
            map(saved => {
              return new PenaltyDecision().clone<PenaltyDecision>({
                ...model,
                id: saved.id,
              });
            }),
          );
        }),
      )
      .subscribe(model => {
        this.model().removePenaltyDecision(this.oldPenaltyDecision());
        this.model().appendPenaltyDecision(model);
        this.updateModel().emit();
        this.toast.success(this.lang.map.the_penalty_saved_successfully);
        this.dialogRef.close();
      });
  }

  selectedPenaltyText(value: number | null) {
    return this.penaltiesMap()[value as unknown as number]
      ? this.penaltiesMap()[value as unknown as number].getNames()
      : '';
  }

  protected readonly Config = Config;

  staticFooterText() {
    return this.offender().type === OffenderTypes.EMPLOYEE
      ? this.lang.map.static_footer_text_for_decision_employee
      : this.lang.map.static_footer_text_for_decision_broker;
  }
}
