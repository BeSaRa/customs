import { Component, computed, inject, signal, OnInit } from '@angular/core';
import { IconButtonComponent } from '@standalone/components/icon-button/icon-button.component';
import { MAT_DIALOG_DATA, MatDialogClose } from '@angular/material/dialog';
import { ButtonComponent } from '@standalone/components/button/button.component';
import { Observable, takeUntil } from 'rxjs';
import { CallRequestService } from '@services/call-request.service';
import { CrudDialogDataContract } from '@contracts/crud-dialog-data-contract';
import { Offender } from '@models/offender';
import { Witness } from '@models/witness';
import { AdminDialogComponent } from '@abstracts/admin-dialog-component';
import { CallRequest } from '@models/call-request';
import {
  AbstractControl,
  ReactiveFormsModule,
  UntypedFormGroup,
  ValidationErrors,
} from '@angular/forms';
import { DatePipe } from '@angular/common';
import { DialogService } from '@services/dialog.service';
import { InvestigationCategory } from '@enums/investigation-category';
import { SummonType } from '@enums/summon-type';
import { InputComponent } from '@standalone/components/input/input.component';
import { SelectInputComponent } from '@standalone/components/select-input/select-input.component';
import { TextareaComponent } from '@standalone/components/textarea/textarea.component';
import {
  compareTwoDates,
  generateTimeList,
  getTimeAsNumberFromGeneratedTime,
} from '@utils/utils';
import {
  MatDatepicker,
  MatDatepickerInput,
} from '@angular/material/datepicker';
import { ControlDirective } from '@standalone/directives/control.directive';
import { OperationType } from '@enums/operation-type';
import { CallRequestStatus } from '@enums/call-request-status';
import { Investigation } from '@models/investigation';
import {
  NgxMatTimepickerComponent,
  NgxMatTimepickerDirective,
} from 'ngx-mat-timepicker';
import { EmployeeService } from '@services/employee.service';
import { CustomValidators } from '@validators/custom-validators';

@Component({
  selector: 'app-call-request-popup',
  standalone: true,
  imports: [
    IconButtonComponent,
    MatDialogClose,
    ButtonComponent,
    InputComponent,
    SelectInputComponent,
    TextareaComponent,
    ReactiveFormsModule,
    MatDatepickerInput,
    MatDatepicker,
    ControlDirective,
    NgxMatTimepickerDirective,
    NgxMatTimepickerComponent,
  ],
  templateUrl: './call-request-popup.component.html',
  styleUrl: './call-request-popup.component.scss',
  providers: [DatePipe],
})
export class CallRequestPopupComponent
  extends AdminDialogComponent<CallRequest>
  implements OnInit
{
  override form!: UntypedFormGroup;
  get summonTimeControl() {
    return this.form.get('summonTime')!;
  }
  get summonDateControl() {
    return this.form.get('summonDate')!;
  }

  callRequestService = inject(CallRequestService);
  data = inject<
    CrudDialogDataContract<
      CallRequest,
      {
        model: Investigation;
        offender?: Offender;
        witness?: Witness;
        caseId: string;
        cameFromCalendar: boolean;
      }
    >
  >(MAT_DIALOG_DATA);

  datePipe = inject(DatePipe);
  dialog = inject(DialogService);
  employeeService = inject(EmployeeService);
  offender = signal(this.data.extras!.offender);
  witness = signal(this.data.extras!.witness);
  cameFromCalendar = signal(this.data.extras!.cameFromCalendar || false);
  isOffender = signal(!!this.offender());
  isWitness = signal(!!this.witness());
  investigationModel = signal(this.data.extras!.model!);
  category = computed(() =>
    this.isOffender()
      ? this.investigationModel().inLegalAffairsActivity()
        ? InvestigationCategory.LEGAL_AFFAIRS_INVESTIGATION_RECORD
        : InvestigationCategory.DISCIPLINARY_COMMITTEE_INVESTIGATION_RECORD
      : this.investigationModel().inLegalAffairsActivity()
        ? InvestigationCategory.LEGAL_AFFAIRS_HEARING_TRANSCRIPT
        : InvestigationCategory.DISCIPLINARY_COMMITTEE_HEARING_TRANSCRIPT,
  );
  summonedType = computed(() =>
    this.isOffender() ? SummonType.OFFENDER : SummonType.WITNESS,
  );
  personId = computed(() => {
    return this.isOffender() ? this.offender()!.id : this.witness()!.id;
  });

  person = computed(() => {
    if (this.isOffender()) {
      const offender = this.offender() as Offender;
      offender.setUseOwnGetNames(this.cameFromCalendar());
      return offender;
    }
    return this.witness();
  });

  private _times = generateTimeList();
  times = this._times;

  today: Date = new Date();

  override ngOnInit(): void {
    super.ngOnInit();
    if (!this.inViewMode()) {
      this._refreshSummonTime(false);
      this.summonDateControl.valueChanges
        .pipe(takeUntil(this.destroy$))
        .subscribe(d => {
          this._refreshSummonTime();
          this._updateTimes();
        });
    }
  }

  // private minTimeValidator(): ValidationErrors | null {
  //   const selectedDate = this.summonDateControl.value;
  //   const selectedTime = this.summonTimeControl.value;
  //
  //   if (!selectedDate || !selectedTime) return null;
  //
  //   const now = new Date();
  //   const selected = new Date(selectedDate);
  //
  //   const isAm = selectedTime.toLowerCase().includes('am');
  //   const isPm = selectedTime.toLowerCase().includes('pm');
  //
  //   let hourPart;
  //   const [rawHour, minutePart] = selectedTime
  //     .replace(/am|pm/i, '')
  //     .trim()
  //     .split(':')
  //     .map(Number);
  //
  //   hourPart = rawHour;
  //   if (isPm && hourPart < 12) hourPart += 12;
  //   if (isAm && hourPart === 12) hourPart = 0;
  //
  //   selected.setHours(hourPart, minutePart, 0, 0);
  //
  //   const minTime = new Date();
  //   minTime.setHours(now.getHours() + 2, now.getMinutes(), 0, 0);
  //
  //   const isToday =
  //     new Date(selectedDate).toDateString() === now.toDateString();
  //
  //   if (isToday && selected < minTime) {
  //     return { minTime: true };
  //   }
  //
  //   return null;
  // }

  private _refreshSummonTime(reset = true) {
    if (
      reset &&
      compareTwoDates(
        new Date(Date.now()),
        new Date(this.summonDateControl.value),
      )
    ) {
      this.summonTimeControl.reset();
    }
    this.summonDateControl.value
      ? this.summonTimeControl.enable()
      : this.summonTimeControl.disable();
  }

  private _updateTimes() {
    const _now = new Date(Date.now());
    this.times = this._times.filter(
      t =>
        !compareTwoDates(_now, new Date(this.summonDateControl.value)) ||
        (getTimeAsNumberFromGeneratedTime(t).hours > _now.getHours() &&
          getTimeAsNumberFromGeneratedTime(t).minutes >= _now.getMinutes()),
    );
  }

  override _buildForm(): void {
    this.form = this.fb.group(this.model.buildForm(true));
    if (this.inViewMode()) {
      this.form.disable();
    }
    this.summonTimeControl.setValidators([
      CustomValidators.required,
      CustomValidators.minTime(() => this.summonDateControl.value),
    ]);
    this.summonDateControl.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.summonTimeControl.updateValueAndValidity();
      });
  }

  protected override _beforeSave(): boolean | Observable<boolean> {
    return this.form.valid;
  }

  protected override _prepareModel(): CallRequest | Observable<CallRequest> {
    return new CallRequest().clone<CallRequest>({
      ...this.model,
      ...this.form.getRawValue(),
      caseId: this.data.extras?.caseId,
      summonedType: this.summonedType(),
      summonedId: this.personId(),
      createdByOUId: this.employeeService.getEmployee()?.defaultOUId,
      isInDC: !!this.employeeService.isDisciplinaryCommittee(),
      status: this.inCreateMode()
        ? CallRequestStatus.UNDER_PROCEDURE
        : this.model.status,
    });
  }

  protected override _afterSave(model: CallRequest): void {
    this.model = model;
    this.operation = OperationType.UPDATE;
    this.toast.success(
      this.lang.map.msg_save_x_success.change({
        x: this.lang.map.call_request,
      }),
    );
    this.dialogRef.close();
  }
}
