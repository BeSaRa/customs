import { Component, inject, OnInit } from '@angular/core';
import { IconButtonComponent } from '@standalone/components/icon-button/icon-button.component';
import { MAT_DIALOG_DATA, MatDialogClose } from '@angular/material/dialog';
import { ButtonComponent } from '@standalone/components/button/button.component';
import { Observable } from 'rxjs';
import { TextareaComponent } from '@standalone/components/textarea/textarea.component';
import { InputComponent } from '@standalone/components/input/input.component';
import { ReactiveFormsModule, UntypedFormGroup } from '@angular/forms';
import {
  MatDatepicker,
  MatDatepickerInput,
} from '@angular/material/datepicker';
import { Meeting } from '@models/meeting';
import { AdminDialogComponent } from '@abstracts/admin-dialog-component';
import { CrudDialogDataContract } from '@contracts/crud-dialog-data-contract';

import { ControlDirective } from '@standalone/directives/control.directive';
import {
  NgxMatTimepickerComponent,
  NgxMatTimepickerDirective,
} from 'ngx-mat-timepicker';
import { EmployeeService } from '@services/employee.service';
import { OperationType } from '@enums/operation-type';
import { MeetingAttendanceListComponent } from '@standalone/components/meeting-attendance-list/meeting-attendance-list.component';
import { LookupService } from '@services/lookup.service';
import { SelectInputComponent } from '@standalone/components/select-input/select-input.component';

@Component({
  selector: 'app-schedule-meeting-popup',
  standalone: true,
  imports: [
    IconButtonComponent,
    MatDialogClose,
    ButtonComponent,
    TextareaComponent,
    InputComponent,
    ReactiveFormsModule,
    MatDatepickerInput,
    MatDatepicker,
    ControlDirective,
    NgxMatTimepickerDirective,
    NgxMatTimepickerComponent,
    MeetingAttendanceListComponent,
    SelectInputComponent,
  ],
  templateUrl: './schedule-meeting-popup.component.html',
  styleUrl: './schedule-meeting-popup.component.scss',
})
export class ScheduleMeetingPopupComponent
  extends AdminDialogComponent<Meeting>
  implements OnInit
{
  override data: CrudDialogDataContract<Meeting, { [index: string]: unknown }> =
    inject(MAT_DIALOG_DATA);
  employeeService = inject(EmployeeService);
  lookupService = inject(LookupService);
  caseId = this.data.extras?.caseId;
  concernedOffendersIds = this.data.extras?.concernedOffendersIds;
  todayDate = new Date();
  maxDate = this.data.extras?.maxDate;
  minDate = this.data.extras?.minDate;
  form!: UntypedFormGroup;
  meetingStatus = this.lookupService.lookups.meetingStatus;

  _buildForm() {
    this.form = this.fb.group(this.model.buildForm(true));
    if (this.operation === OperationType.VIEW) {
      this.form.disable();
    }
  }

  protected override _beforeSave(): boolean | Observable<boolean> {
    return this.form.valid;
  }

  protected override _prepareModel(): Meeting | Observable<Meeting> {
    const formValue = this.form.getRawValue();
    return new Meeting().clone<Meeting>({
      ...this.model,
      ...formValue,
      caseId: this.caseId,
      offenderList: this.concernedOffendersIds,
    });
  }

  get label() {
    if (this.operation === OperationType.CREATE) {
      return 'schedule_meeting';
    } else if (this.operation === OperationType.UPDATE) {
      return 'update_meeting';
    } else {
      return 'meeting_details';
    }
  }

  protected override _afterSave(model: Meeting): void {
    this.dialogRef.close(model);
  }

  protected readonly OperationType = OperationType;
}
