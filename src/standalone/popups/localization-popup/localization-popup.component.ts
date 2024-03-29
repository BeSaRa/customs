import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { CrudDialogDataContract } from '@contracts/crud-dialog-data-contract';
import { Localization } from '@models/localization';
import { AdminDialogComponent } from '@abstracts/admin-dialog-component';
import { ReactiveFormsModule, UntypedFormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { OperationType } from '@enums/operation-type';

import { InputComponent } from '@standalone/components/input/input.component';
import { IconButtonComponent } from '@standalone/components/icon-button/icon-button.component';
import { TextareaComponent } from '@standalone/components/textarea/textarea.component';
import { ButtonComponent } from '@standalone/components/button/button.component';

@Component({
  selector: 'app-localization-popup',
  templateUrl: './localization-popup.component.html',
  styleUrls: ['./localization-popup.component.scss'],
  standalone: true,
  imports: [
    InputComponent,
    IconButtonComponent,
    TextareaComponent,
    ButtonComponent,
    ReactiveFormsModule,
    MatDialogModule,
  ],
})
export class LocalizationPopupComponent extends AdminDialogComponent<Localization> {
  form!: UntypedFormGroup;
  data: CrudDialogDataContract<Localization> = inject(MAT_DIALOG_DATA);

  _buildForm(): void {
    this.form = this.fb.group(this.model.buildForm(true));
  }

  protected _beforeSave(): boolean | Observable<boolean> {
    this.form.markAllAsTouched();
    return this.form.valid;
  }

  protected _prepareModel(): Localization | Observable<Localization> {
    return new Localization().clone<Localization>({
      ...this.model,
      ...this.form.value,
    });
  }

  protected _afterSave(model: Localization): void {
    this.model = model;
    this.operation = OperationType.UPDATE;
    this.toast.success(
      this.lang.map.msg_save_x_success.change({ x: this.model.getNames() }),
    );
    this.dialogRef.close(this.model);
  }
}
