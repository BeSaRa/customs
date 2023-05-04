import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CrudDialogDataContract } from '@contracts/crud-dialog-data-contract';
import { ViolationClassification } from '@models/violation-classification';
import { AdminDialogComponent } from '@abstracts/admin-dialog-component';
import { UntypedFormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { OperationType } from '@enums/operation-type';
import { LookupService } from '@services/lookup.service';
import { Lookup } from '@models/lookup';
import { Localization } from '@models/localization';
import { LangService } from '@services/lang.service';
import { LangCodes } from '@enums/lang-codes';

@Component({
  selector: 'app-violation-classification-popup',
  templateUrl: './violation-classification-popup.component.html',
  styleUrls: ['./violation-classification-popup.component.scss'],
})
export class ViolationClassificationPopupComponent extends AdminDialogComponent<ViolationClassification> {
  form!: UntypedFormGroup;
  data: CrudDialogDataContract<ViolationClassification> =
    inject(MAT_DIALOG_DATA);
  types: any[] = inject(LookupService).lookups.penaltyType;
  isArabic = inject(LangService).getCurrent().code === LangCodes.AR;

  _buildForm(): void {
    this.form = this.fb.group(this.model.buildForm(true));
  }

  protected _beforeSave(): boolean | Observable<boolean> {
    this.form.markAllAsTouched();
    return this.form.valid;
  }

  protected _prepareModel():
    | ViolationClassification
    | Observable<ViolationClassification> {
    return new ViolationClassification().clone<ViolationClassification>({
      ...this.model,
      ...this.form.value,
    });
  }

  protected _afterSave(model: ViolationClassification): void {
    this.model = model;
    this.operation = OperationType.UPDATE;
    this.toast.success(
      this.lang.map.msg_save_x_success.change({ x: this.model.getNames() })
    );
    // you can close the dialog after save here
    this.dialogRef.close(this.model);
  }
}
