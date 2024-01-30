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
import { Offender } from '@models/offender';
import { Investigation } from '@models/investigation';
import { ButtonComponent } from '@standalone/components/button/button.component';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IconButtonComponent } from '@standalone/components/icon-button/icon-button.component';
import { InputComponent } from '@standalone/components/input/input.component';
import { LangService } from '@services/lang.service';
import { AsyncPipe, DatePipe } from '@angular/common';
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
import { OffenderViolation } from '@models/offender-violation';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { ToastService } from '@services/toast.service';
import {
  exhaustMap,
  filter,
  map,
  switchMap,
  take,
  takeUntil,
  tap,
} from 'rxjs/operators';
import { OnDestroyMixin } from '@mixins/on-destroy-mixin';
import { merge, startWith, Subject } from 'rxjs';
import { MatRadioButton } from '@angular/material/radio';
import { MatTooltip } from '@angular/material/tooltip';
import {
  MatOption,
  MatSelect,
  MatSelectTrigger,
} from '@angular/material/select';
import { SelectInputComponent } from '@standalone/components/select-input/select-input.component';
import { OptionTemplateDirective } from '@standalone/directives/option-template.directive';
import { LookupService } from '@services/lookup.service';
import { Lookup } from '@models/lookup';
import { TextareaComponent } from '@standalone/components/textarea/textarea.component';
import { CustomValidators } from '@validators/custom-validators';
import { Penalty } from '@models/penalty';
import { PenaltyDecision } from '@models/penalty-decision';
import { EmployeeService } from '@services/employee.service';
import { DialogService } from '@services/dialog.service';

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
  }>(MAT_DIALOG_DATA);
  dialogRef = inject(MatDialogRef);
  lang = inject(LangService);
  toast = inject(ToastService);
  lookupService = inject(LookupService);
  loadPenalties$ = new Subject<void>();
  save$ = new Subject<void>();
  employeeService = inject(EmployeeService);
  dialog = inject(DialogService);
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
  proofStatusMap = computed(() => {
    return this.proofStatus().reduce<Record<number, Lookup>>((acc, current) => {
      return { ...acc, [current.lookupKey]: current };
    }, {});
  });
  controls = computed(() => {
    return this.offenderViolations().map(item => {
      return new FormControl(item.proofStatus);
    });
  });
  updateModel = this.data.updateModel;
  oldPenaltyDecision = computed(() => {
    const p = this.model().getPenaltyDecisionByOffenderId(this.offender().id);
    console.log({ p });
    return p;
  });
  oldPenaltyId = computed(() => {
    return this.oldPenaltyDecision()?.penaltyId;
  });
  oldPenaltyComment = computed(() => {
    return this.oldPenaltyDecision()?.comment;
  });
  penaltiesMap = signal<Record<number, Penalty>>({});
  penaltyControl = new FormControl<number | null>(this.oldPenaltyId()!, {
    nonNullable: false,
    validators: [CustomValidators.required],
  });
  textControl: FormControl = new FormControl<string>(this.oldPenaltyComment()!);
  penalties$ = merge(this.loadPenalties$)
    .pipe(tap(() => this.penaltyControl.reset()))
    .pipe(startWith(undefined))
    .pipe(switchMap(() => this.model().loadPenalties()))
    .pipe(
      map(value => {
        return value[this.offender().id];
      }),
      tap(values => {
        this.penaltiesMap.set(
          values.second.reduce((acc, current) => {
            return { ...acc, [current.id]: current };
          }, {}),
        );
      }),
    );
  displayedColumns = ['violation', 'createdOn', 'proofStatus'];

  assetType(element: unknown): OffenderViolation {
    return element as OffenderViolation;
  }

  ngOnInit(): void {
    this.loadPenalties$.next();
    this.listenToSave();
  }

  updateIsProve(item: OffenderViolation, index: number) {
    Promise.resolve().then(() => {
      item.proofStatus = this.controls()[index].value!;
      const offenderViolationIndex =
        this.model().offenderViolationInfo.findIndex(i => {
          return i === item;
        });

      item
        .update()
        .pipe(takeUntil(this.destroy$), take(1))
        .subscribe(model => {
          this.model().offenderViolationInfo.splice(
            offenderViolationIndex,
            1,
            model,
          );
          this.data.updateModel().emit();
          this.toast.success(
            this.lang.map.is_proved_status_updated_successfully,
          );
          this.loadPenalties$.next();
        });
    });
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
      penaltyInfo: this.penaltiesMap()[this.penaltyControl.value!],
    });
  }

  private listenToSave() {
    this.save$
      .pipe(takeUntil(this.destroy$))
      .pipe(map(() => this.penaltyControl.valid))
      .pipe(
        tap(
          valid =>
            !valid &&
            this.dialog.error(this.lang.map.please_select_penalty_to_proceed),
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
          return model.save().pipe(
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
}
