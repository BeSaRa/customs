import { Component, inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CrudDialogDataContract } from '@contracts/crud-dialog-data-contract';
import { SuspendedEmployee } from '@models/suspended-employee';
import { AdminDialogComponent } from '@abstracts/admin-dialog-component';
import { UntypedFormGroup } from '@angular/forms';
import {
  catchError,
  exhaustMap,
  filter,
  isObservable,
  Observable,
  of,
  Subject,
  switchMap,
  takeUntil,
  throwError,
} from 'rxjs';
import { OperationType } from '@enums/operation-type';
import { ignoreErrors } from '@utils/utils';
import { InvestigationService } from '@services/investigation.service';
import { SuspendedEmployeeService } from '@services/suspended-employee.service';
import { EmployeeService } from '@services/employee.service';

@Component({
  selector: 'app-suspended-employee-popup',
  templateUrl: './suspended-employee-popup.component.html',
  styleUrls: ['./suspended-employee-popup.component.scss'],
})
export class SuspendedEmployeePopupComponent
  extends AdminDialogComponent<SuspendedEmployee>
  implements OnInit
{
  form!: UntypedFormGroup;
  data: CrudDialogDataContract<SuspendedEmployee> = inject(MAT_DIALOG_DATA);
  investigationService = inject(InvestigationService);
  suspendedEmployeeService = inject(SuspendedEmployeeService);
  employeeService = inject(EmployeeService);
  saveExtendSuspension$: Subject<void> = new Subject<void>();

  override ngOnInit(): void {
    super.ngOnInit();
    this._listenToSaveExtendSuspension();
  }

  _buildForm(): void {
    this.form = this.fb.group(this.model.buildForm());
    this.form.controls['arName'].disable();
    this.form.controls['enName'].disable();
  }

  protected _beforeSave(): boolean | Observable<boolean> {
    this.form.markAllAsTouched();
    return this.form.valid;
  }

  protected _prepareModel(): SuspendedEmployee | Observable<SuspendedEmployee> {
    return new SuspendedEmployee().clone<SuspendedEmployee>({
      ...this.model,
      ...this.form.value,
    });
  }

  protected _afterSave(model: SuspendedEmployee): void {
    this.model = model;
    this.operation = OperationType.UPDATE;
    this.toast.success(
      this.lang.map.msg_save_x_success.change({ x: this.model.getNames() }),
    );
    // you can close the dialog after save here
    this.dialogRef.close(this.model);
  }

  protected _listenToSaveExtendSuspension() {
    this.saveExtendSuspension$
      .pipe(
        takeUntil(this.destroy$),
        switchMap(() => {
          const result = this._beforeSave();
          return isObservable(result) ? result : of(result);
        }),
      )
      .pipe(filter((value) => value))
      .pipe(
        switchMap(() => {
          const result = this._prepareModel();
          return isObservable(result) ? result : of(result);
        }),
      )
      .pipe(
        exhaustMap((model) => {
          return this.suspendedEmployeeService.saveExtendSuspension(model).pipe(
            catchError((error) => {
              this._saveFail(error);
              return throwError(error);
            }),
            ignoreErrors(),
          );
        }),
      )
      .subscribe(() => {
        this._afterSave(new SuspendedEmployee());
      });
  }
}
