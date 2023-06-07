import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CrudDialogDataContract } from '@contracts/crud-dialog-data-contract';
import { EmailTemplate } from '@models/email-template';
import { AdminDialogComponent } from '@abstracts/admin-dialog-component';
import { UntypedFormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { OperationType } from '@enums/operation-type';
import { AngularEditorConfig } from '@kolkov/angular-editor';
@Component({
  selector: 'app-email-template-popup',
  templateUrl: './email-template-popup.component.html',
  styleUrls: ['./email-template-popup.component.scss'],
})
export class EmailTemplatePopupComponent extends AdminDialogComponent<EmailTemplate> {
  editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: 'auto',
    minHeight: '0',
    maxHeight: 'auto',
    width: 'auto',
    minWidth: '0',
    translate: 'yes',
    enableToolbar: true,
    showToolbar: true,
    placeholder: 'Enter text here...',
    defaultParagraphSeparator: '',
    defaultFontName: '',
    defaultFontSize: '',
    fonts: [
      { class: 'arial', name: 'Arial' },
      { class: 'times-new-roman', name: 'Times New Roman' },
      { class: 'calibri', name: 'Calibri' },
      { class: 'comic-sans-ms', name: 'Comic Sans MS' },
    ],
    customClasses: [
      {
        name: 'quote',
        class: 'quote',
      },
      {
        name: 'redText',
        class: 'redText',
      },
      {
        name: 'titleText',
        class: 'titleText',
        tag: 'h1',
      },
    ],
    uploadUrl: 'v1/image',
    uploadWithCredentials: false,
    sanitize: true,
    toolbarPosition: 'top',
    toolbarHiddenButtons: [['bold', 'italic'], ['fontSize']],
  };

  form!: UntypedFormGroup;
  data: CrudDialogDataContract<EmailTemplate> = inject(MAT_DIALOG_DATA);
  get arBodyTemplate() {
    return this.form.get('arBodyTemplate')?.value ?? '';
  }
  get enBodyTemplate() {
    return this.form.get('enBodyTemplate')?.value ?? '';
  }

  _buildForm(): void {
    this.form = this.fb.group(this.model.buildForm(true));
  }

  protected _beforeSave(): boolean | Observable<boolean> {
    this.form.markAllAsTouched();
    return this.form.valid;
  }

  protected _prepareModel(): EmailTemplate | Observable<EmailTemplate> {
    console.log(
      '',
      new EmailTemplate().clone<EmailTemplate>({
        ...this.model,
        ...this.form.value,
      })
    );
    return new EmailTemplate().clone<EmailTemplate>({
      ...this.model,
      ...this.form.value,
    });
  }

  protected _afterSave(model: EmailTemplate): void {
    this.model = model;
    this.operation = OperationType.UPDATE;
    this.toast.success(this.lang.map.msg_save_x_success.change({ x: this.model.getNames() }));
    // you can close the dialog after save here
    this.dialogRef.close(this.model);
  }
}
