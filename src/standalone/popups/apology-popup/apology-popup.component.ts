import { Component, inject, OnInit } from '@angular/core';
import { ButtonComponent } from '@standalone/components/button/button.component';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  UntypedFormGroup,
} from '@angular/forms';
import { IconButtonComponent } from '@standalone/components/icon-button/icon-button.component';
import { InputComponent } from '@standalone/components/input/input.component';
import { MatCell } from '@angular/material/table';
import {
  MAT_DIALOG_DATA,
  MatDialogClose,
  MatDialogRef,
} from '@angular/material/dialog';
import { TextareaComponent } from '@standalone/components/textarea/textarea.component';
import { CrudDialogDataContract } from '@contracts/crud-dialog-data-contract';
import { Observable, Subject, switchMap } from 'rxjs';
import { OnDestroyMixin } from '@mixins/on-destroy-mixin';
import { CallRequest } from '@models/call-request';
import { ApologyModel } from '@models/apology-model';
import { LangService } from '@services/lang.service';
import { CallRequestService } from '@services/call-request.service';
import { SelectInputComponent } from '@standalone/components/select-input/select-input.component';
import { LookupService } from '@services/lookup.service';
import { Lookup } from '@models/lookup';
import { ControlDirective } from '@standalone/directives/control.directive';
import {
  MatDatepicker,
  MatDatepickerInput,
} from '@angular/material/datepicker';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-apology-popup',
  standalone: true,
  imports: [
    ButtonComponent,
    FormsModule,
    IconButtonComponent,
    InputComponent,
    MatCell,
    MatDialogClose,
    ReactiveFormsModule,
    TextareaComponent,
    SelectInputComponent,
    ControlDirective,
    MatDatepicker,
    MatDatepickerInput,
  ],
  templateUrl: './apology-popup.component.html',
  styleUrl: './apology-popup.component.scss',
})
export class ApologyPopupComponent
  extends OnDestroyMixin(class {})
  implements OnInit
{
  lang = inject(LangService);
  fb = inject(FormBuilder);
  dialogRef = inject(MatDialogRef);
  CallRequestService = inject(CallRequestService);
  lookupService = inject(LookupService);
  apologyReasons = this.lookupService.lookups.apologyReason.sort(
    (a: Lookup, b: Lookup) => a.lookupKey - b.lookupKey,
  );
  form!: UntypedFormGroup;
  todayDate = new Date();
  data: CrudDialogDataContract<CallRequest> = inject(MAT_DIALOG_DATA);
  save$: Subject<void> = new Subject<void>();

  ngOnInit(): void {
    this._buildForm();
    this._listenToSave();
  }

  _buildForm(): void {
    this.form = this.fb.group(new ApologyModel().buildForm());
  }

  _listenToSave() {
    this.save$
      .pipe(filter(() => this._beforeSave()))
      .pipe(
        switchMap(() => {
          return this.CallRequestService.apology({
            id: this.data.model.id,
            ...this.form.getRawValue(),
          });
        }),
      )
      .subscribe(() => {
        this.dialogRef.close();
      });
  }

  protected _beforeSave(): boolean {
    this.form.markAllAsTouched();
    return this.form.valid;
  }

  protected _prepareModel(): CallRequest | Observable<CallRequest> {
    return new CallRequest().clone<CallRequest>({
      ...this.form.value,
    });
  }
}
