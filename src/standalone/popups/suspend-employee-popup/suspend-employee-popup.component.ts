import { Component, OnInit, inject } from '@angular/core';
import {
  FormsModule,
  ReactiveFormsModule,
  UntypedFormBuilder,
  UntypedFormGroup,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { OnDestroyMixin } from '@mixins/on-destroy-mixin';
import { SuspendedEmployee } from '@models/suspended-employee';
import { LangService } from '@services/lang.service';
import { SuspendedEmployeeService } from '@services/suspended-employee.service';
import { ToastService } from '@services/toast.service';
import { ButtonComponent } from '@standalone/components/button/button.component';
import { IconButtonComponent } from '@standalone/components/icon-button/icon-button.component';
import { InputComponent } from '@standalone/components/input/input.component';
import { SwitchComponent } from '@standalone/components/switch/switch.component';
import { ignoreErrors } from '@utils/utils';
import {
  Observable,
  Subject,
  catchError,
  exhaustMap,
  filter,
  isObservable,
  of,
  switchMap,
  takeUntil,
  throwError,
} from 'rxjs';
import { ControlDirective } from '@standalone/directives/control.directive';

@Component({
  selector: 'app-suspend-employee-popup',
  templateUrl: './suspend-employee-popup.component.html',
  styleUrls: ['./suspend-employee-popup.component.scss'],
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatDatepickerModule,
    MatButtonModule,
    ButtonComponent,
    IconButtonComponent,
    FormsModule,
    ReactiveFormsModule,
    InputComponent,
    SwitchComponent,
    MatDialogModule,
    ControlDirective,
  ],
})
export class SuspendEmployeePopupComponent
  extends OnDestroyMixin(class {})
  implements OnInit
{
  lang = inject(LangService);
  dialogRef = inject(MatDialogRef);
  fb = inject(UntypedFormBuilder);
  toast = inject(ToastService);
  suspendedEmpService = inject(SuspendedEmployeeService);
  model: SuspendedEmployee = inject(MAT_DIALOG_DATA);
  form!: UntypedFormGroup;
  save$: Subject<void> = new Subject<void>();
  today = new Date();

  protected _buildForm(): void {
    this.form = this.fb.group(this.model.buildForm());
    this.form.controls['arName'].disable();
    this.form.controls['enName'].disable();
    this.form.controls['dateFrom'].setValue(this.today);
  }

  ngOnInit() {
    this._buildForm();
    this._listenToSave();
  }

  protected _listenToSave() {
    this.save$
      .pipe(
        takeUntil(this.destroy$),
        switchMap(() => {
          const result = this._beforeSave();
          return isObservable(result) ? result : of(result);
        }),
      )
      .pipe(filter(value => value))
      .pipe(
        switchMap(() => {
          const result = this._prepareModel();
          return isObservable(result) ? result : of(result);
        }),
      )
      .pipe(
        exhaustMap(model => {
          return this.suspendedEmpService.saveSuspension(model).pipe(
            catchError(error => {
              this._saveFail(error);
              return throwError(error);
            }),
            ignoreErrors(),
          );
        }),
      )
      .subscribe(() => {
        this._afterSave();
      });
  }

  protected _prepareModel(): SuspendedEmployee | Observable<SuspendedEmployee> {
    return new SuspendedEmployee().clone<SuspendedEmployee>({
      ...this.model,
      ...this.form.value,
    });
  }

  protected _beforeSave(): boolean | Observable<boolean> {
    this.form.markAllAsTouched();
    return this.form.valid;
  }

  protected _afterSave(): void {
    this.toast.success(
      this.lang.map.msg_save_x_success.change({ x: this.model.getNames() }),
    );
    // you can close the dialog after save here
    this.dialogRef.close();
  }

  protected _saveFail(error: unknown) {
    console.log(error);
  }
}
