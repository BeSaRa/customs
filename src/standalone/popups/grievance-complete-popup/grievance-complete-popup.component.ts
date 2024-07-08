import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ButtonComponent } from '@standalone/components/button/button.component';
import { IconButtonComponent } from '@standalone/components/icon-button/icon-button.component';
import {
  MAT_DIALOG_DATA,
  MatDialogClose,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { TextareaComponent } from '@standalone/components/textarea/textarea.component';
import { LangService } from '@services/lang.service';
import {
  FormBuilder,
  FormControl,
  ReactiveFormsModule,
  UntypedFormGroup,
} from '@angular/forms';
import { OnDestroyMixin } from '@mixins/on-destroy-mixin';
import { LookupService } from '@services/lookup.service';
import { Penalty } from '@models/penalty';
import { GrievanceFinalDecisionsEnum } from '@enums/grievance-final-decisions-enum';
import { CustomValidators } from '@validators/custom-validators';
import { SelectInputComponent } from '@standalone/components/select-input/select-input.component';
import { Grievance } from '@models/grievance';
import { filter, Subject, switchMap, tap } from 'rxjs';
import { UserClick } from '@enums/user-click';
import { DialogService } from '@services/dialog.service';
import { DatePipe } from '@angular/common';
import { MatCell } from '@angular/material/table';
import { MatRadioButton, MatRadioGroup } from '@angular/material/radio';
import { MatOption } from '@angular/material/autocomplete';
import { MatSelect, MatSelectTrigger } from '@angular/material/select';
import { PenaltyDecision } from '@models/penalty-decision';
import { ReportStatus } from '@enums/report-status';
import { EmployeeService } from '@services/employee.service';
import { TeamNames } from '@enums/team-names';
import { Config } from '@constants/config';

@Component({
  selector: 'app-grievance-complete-popup',
  standalone: true,
  imports: [
    ButtonComponent,
    IconButtonComponent,
    MatDialogClose,
    MatIcon,
    TextareaComponent,
    SelectInputComponent,
    ReactiveFormsModule,
    DatePipe,
    MatCell,
    MatRadioGroup,
    MatRadioButton,
    MatOption,
    MatSelectTrigger,
    MatSelect,
  ],
  templateUrl: './grievance-complete-popup.component.html',
  styleUrl: './grievance-complete-popup.component.scss',
})
export class GrievanceCompletePopupComponent
  extends OnDestroyMixin(class {})
  implements OnInit
{
  lang = inject(LangService);
  lookupService = inject(LookupService);
  data = inject(MAT_DIALOG_DATA);
  fb = inject(FormBuilder);
  dialogRef = inject(MatDialogRef);
  dialog = inject(DialogService);
  employeeService = inject(EmployeeService);
  model = this.data.model;
  response = this.data.response;
  grievanceFinalDecisions = this.lookupService.lookups.GrievanceFinalDecision;
  penaltiesList = signal<Penalty[]>([]);
  form!: UntypedFormGroup;
  save$: Subject<void> = new Subject<void>();
  todayDate = new Date();

  penaltiesMap = computed<Record<number, Penalty>>(() => {
    return this.penaltiesList().reduce((acc, item) => {
      return { ...acc, [item.id]: item };
    }, {});
  });

  focusOnSelect(select: MatSelect) {
    select.focus();
    select.toggle();
  }

  ngOnInit(): void {
    this.buildForm();
    this.listenToSave();
    this.loadPenalties();
    this.loadPenalties().subscribe((penalties: Penalty[]) => {
      this.penaltiesList.set(penalties.filter(item => !item.isSystem));
    });
  }

  buildForm() {
    this.form = this.fb.group(
      new Grievance().clone<Grievance>({ ...this.model }).buildCompleteForm(),
    );
    if (
      this.finalDecisionsCtrl.value ===
      GrievanceFinalDecisionsEnum.UPDATE_PENALTY
    ) {
      this.penaltyCtrl.enable();
    }
  }

  listenToSave() {
    this.save$
      .pipe(
        tap(
          () =>
            this.form.invalid &&
            this.dialog.error(
              this.lang.map.msg_make_sure_all_required_fields_are_filled,
            ),
        ),
        filter(() => this.form.valid),
        switchMap(() => {
          return new PenaltyDecision()
            .clone<PenaltyDecision>({
              caseId: this.model.id,
              offenderId: this.model.offenderId,
              signerId: this.employeeService.getEmployee()?.id,
              penaltyId: this.penaltyCtrl.value!,
              comment: this.form.getRawValue().justification,
              status: 1,
              // ...(this.isBroker()
              //   ? { customsViolationEffect: this.oldDecisionCustomsViolationEffect.value }
              //   : null),
              penaltyInfo: this.penaltiesMap()[this.penaltyCtrl.value!],
              tkiid: this.model.getTaskId(),
              roleAuthName: this.model.getTeamDisplayName(),
              decisionType:
                this.model.getTeamDisplayName() ===
                  TeamNames.President_Office ||
                this.model.getTeamDisplayName() ===
                  TeamNames.President_Assistant_Office
                  ? ReportStatus.GRIEVANCE_DRAFT
                  : ReportStatus.GRIEVANCE_APPROVED,
            })
            .save();
        }),
        switchMap(() => {
          return new Grievance()
            .clone<Grievance>({
              ...this.model,
              ...this.form.getRawValue(),
            })
            .save();
        }),
      )
      .subscribe(() => {
        this.dialogRef.close(UserClick.YES);
      });
  }

  private loadPenalties() {
    return this.model.getService().grievancePenalty(this.model.offenderId);
  }

  handleFinalDecisionChanged(decision: unknown) {
    this.penaltyCtrl.setValidators([]);
    this.penaltyCtrl.disable();
    if (decision === GrievanceFinalDecisionsEnum.UPDATE_PENALTY) {
      this.penaltyCtrl.enable();
      this.penaltyCtrl.setValidators([CustomValidators.required]);
    }
  }

  get penaltyCtrl(): FormControl {
    return this.form.get('penaltyId') as FormControl;
  }

  get finalDecisionsCtrl(): FormControl {
    return this.form.get('finalDecision') as FormControl;
  }

  selectedPenaltyText(value: number | null) {
    return this.penaltiesMap()[value as unknown as number]
      ? this.penaltiesMap()[value as unknown as number].getNames()
      : '';
  }

  protected readonly Config = Config;
}
