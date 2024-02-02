import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  UntypedFormGroup,
} from '@angular/forms';
import { ButtonComponent } from '@standalone/components/button/button.component';
import { IconButtonComponent } from '@standalone/components/icon-button/icon-button.component';
import { InputComponent } from '@standalone/components/input/input.component';
import {
  MAT_DIALOG_DATA,
  MatDialogClose,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatTab, MatTabGroup } from '@angular/material/tabs';
import { SelectInputComponent } from '@standalone/components/select-input/select-input.component';
import { LangService } from '@services/lang.service';
import {
  catchError,
  EMPTY,
  filter,
  isObservable,
  mergeMap,
  Observable,
  of,
  ReplaySubject,
  switchMap,
  throwError,
} from 'rxjs';
import { MawaredEmployeeService } from '@services/mawared-employee.service';
import { ControlDirective } from '@standalone/directives/control.directive';
import {
  MatDatepicker,
  MatDatepickerInput,
} from '@angular/material/datepicker';
import { ignoreErrors } from '@utils/utils';
import { CustomValidators } from '@validators/custom-validators';
import { CrudDialogDataContract } from '@contracts/crud-dialog-data-contract';
import { ClearingAgentService } from '@services/clearing-agent.service';
import { ClearingAgencyService } from '@services/clearing-agency.service';
import { IntegrationsCases } from '@enums/integrations-cases';

@Component({
  selector: 'app-integration-popup',
  standalone: true,
  imports: [
    ButtonComponent,
    FormsModule,
    IconButtonComponent,
    InputComponent,
    MatDialogClose,
    MatTab,
    MatTabGroup,
    ReactiveFormsModule,
    SelectInputComponent,
    ControlDirective,
    MatDatepicker,
    MatDatepickerInput,
  ],
  templateUrl: './integration-popup.component.html',
  styleUrl: './integration-popup.component.scss',
})
export class IntegrationPopupComponent implements OnInit {
  form!: UntypedFormGroup;
  lang = inject(LangService);
  mawaredEmployeeService = inject(MawaredEmployeeService);
  clearingAgentService = inject(ClearingAgentService);
  clearingAgencyService = inject(ClearingAgencyService);
  sync$ = new ReplaySubject<void>(1);
  fb = inject(FormBuilder);
  dialogRef = inject(MatDialogRef);
  data = inject(MAT_DIALOG_DATA);

  ngOnInit() {
    this.buildForm();
    this.listenToSync();
  }

  buildForm(): void {
    if (this.isMawaredEmployee) {
      this.form = this.fb.group({
        startEmployeesDate: ['', CustomValidators.required],
        endEmployeesDate: ['', CustomValidators.required],
        changeDepartmentsDate: ['', CustomValidators.required],
      });
    } else {
      this.form = this.fb.group({
        startDate: ['', CustomValidators.required],
        endDate: ['', CustomValidators.required],
      });
    }
  }

  protected _beforeSave(): boolean | Observable<boolean> {
    this.form.markAllAsTouched();
    return this.form.valid;
  }

  protected listenToSync() {
    this.sync$
      .pipe(
        switchMap(() => {
          const result = this._beforeSave();
          return isObservable(result) ? result : of(result);
        }),
        filter(value => value),
        switchMap(() => {
          if (this.isMawaredEmployee) {
            return this.mawaredEmployeeService.syncForIntegration(
              this.form.value,
            );
          } else if (this.isClearingAgent) {
            return this.clearingAgentService.syncForIntegration(
              this.form.value,
            );
          } else if (this.isClearingAgency) {
            return this.clearingAgencyService.syncForIntegration(
              this.form.value,
            );
          } else {
            return EMPTY;
          }
        }),
        catchError(error => {
          return throwError(error);
        }),
        ignoreErrors(),
      )
      .subscribe(() => this.dialogRef.close());
  }

  get isMawaredEmployee() {
    return this.data.fromComponent === IntegrationsCases.MAWARED_EMPLOYEE;
  }

  get isClearingAgent() {
    return this.data.fromComponent === IntegrationsCases.CLEARING_AGENT;
  }

  get isClearingAgency() {
    return this.data.fromComponent === IntegrationsCases.CLEARING_AGENCY;
  }
}
