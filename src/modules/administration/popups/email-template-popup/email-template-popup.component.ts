import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CrudDialogDataContract } from '@contracts/crud-dialog-data-contract';
import { EmailTemplate } from '@models/email-template';
import { AdminDialogComponent } from '@abstracts/admin-dialog-component';
import { UntypedFormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { OperationType } from '@enums/operation-type';

@Component({
  selector: 'app-email-template-popup',
  templateUrl: './email-template-popup.component.html',
  styleUrls: ['./email-template-popup.component.scss'],
})
export class EmailTemplatePopupComponent extends AdminDialogComponent<EmailTemplate> {
  form!: UntypedFormGroup;
  data: CrudDialogDataContract<EmailTemplate> = inject(MAT_DIALOG_DATA);
  activeTab = 0;

  FocusInvalidTab() {
    const validArBodyTemplate = this.form.get('arBodyTemplate')?.valid;
    const validEnBodyTemplate = this.form.get('enBodyTemplate')?.valid;

    const validBasicInfo =
      this.form.get('arName')?.valid &&
      this.form.get('enName')?.valid &&
      this.form.get('arSubjectTemplate')?.valid &&
      this.form.get('enSubjectTemplate')?.valid;

    if (!validBasicInfo) {
      this.activeTab = 0;
    } else if (!validArBodyTemplate) {
      this.activeTab = 1;
    } else if (!validEnBodyTemplate) {
      this.activeTab = 2;
    }
  }

  _buildForm(): void {
    this.form = this.fb.group(this.model.buildForm(true));
  }

  protected _beforeSave(): boolean | Observable<boolean> {
    this.form.markAllAsTouched();
    this.FocusInvalidTab();

    return this.form.valid;
  }

  protected _prepareModel(): EmailTemplate | Observable<EmailTemplate> {
    const newModel = new EmailTemplate().clone<EmailTemplate>({
      ...this.model,
      ...this.form.value,
    });
    return newModel;
  }

  protected _afterSave(model: EmailTemplate): void {
    this.model = model;
    this.operation = OperationType.UPDATE;
    this.toast.success(
      this.lang.map.msg_save_x_success.change({ x: this.model.getNames() }),
    );
    // you can close the dialog after save here
    this.dialogRef.close(this.model);
  }
}
