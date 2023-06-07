import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CrudDialogDataContract } from '@contracts/crud-dialog-data-contract';
import { GlobalSetting } from '@models/global-setting';
import { AdminDialogComponent } from '@abstracts/admin-dialog-component';
import { FormArray, FormControl, UntypedFormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { OperationType } from '@enums/operation-type';
import { FileTypeService } from '@services/file-type.service';
import { FileType } from '@models/file-type';
import { CustomValidators } from '@validators/custom-validators';

@Component({
  selector: 'app-global-setting-popup',
  templateUrl: './global-setting-popup.component.html',
  styleUrls: ['./global-setting-popup.component.scss'],
})
export class GlobalSettingPopupComponent extends AdminDialogComponent<GlobalSetting> {
  form!: UntypedFormGroup;
  data: CrudDialogDataContract<GlobalSetting> = inject(MAT_DIALOG_DATA);
  fileTypeService = inject(FileTypeService);
  fileTypes!: FileType[];

  protected override _initPopup(): void {
    super._initPopup();
    this.getFileTypes();
  }

  _buildForm(): void {
    this.form = this.fb.group({
      ...this.model.buildForm(true),
      supportEmailListParsed: this.fb.array([['', CustomValidators.required]]),
    });
    if (this.operation === OperationType.UPDATE) {
      this.supportEmailListParsed.removeAt(0);
      this.model.supportEmailListParsed.forEach(element => {
        this.supportEmailListParsed.push(new FormControl(element, CustomValidators.required));
      });
    }
  }

  protected _beforeSave(): boolean | Observable<boolean> {
    this.form.markAllAsTouched();
    return this.form.valid;
  }

  protected _prepareModel(): GlobalSetting | Observable<GlobalSetting> {
    const a = new GlobalSetting().clone<GlobalSetting>({
      ...this.model,
      ...this.form.value,
    });

    return new GlobalSetting().clone<GlobalSetting>({
      ...this.model,
      ...this.form.value,
    });
  }

  protected _afterSave(model: GlobalSetting): void {
    this.model = model;
    this.operation = OperationType.UPDATE;
    console.log(this.model);

    this.toast.success(this.lang.map.msg_save_x_success.change({ x: this.getApplicationName() }));
    // you can close the dialog after save here
    // this.dialogRef.close(this.model);
  }

  protected getFileTypes() {
    this.fileTypeService.load().subscribe(data => {
      this.fileTypes = data.rs;
    });
  }

  get supportEmailListParsed() {
    return this.form.controls['supportEmailListParsed'] as FormArray;
  }

  addEmail() {
    this.supportEmailListParsed.push(new FormControl('', [CustomValidators.required, CustomValidators.pattern('EMAIL')]));
  }

  deleteEmail(emailIndex: number) {
    this.supportEmailListParsed.removeAt(emailIndex);
  }

  getApplicationName(): string {
    return this.lang.getCurrent().code === 'ar' ? this.model.systemArabicName : this.model.systemEnglishName;
  }
}
