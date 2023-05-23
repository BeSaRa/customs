import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CrudDialogDataContract } from '@contracts/crud-dialog-data-contract';
import { MawaredEmployee } from '@models/mawared-employee';
import { AdminDialogComponent } from '@abstracts/admin-dialog-component';
import { UntypedFormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { OperationType } from '@enums/operation-type';
import { LookupService } from '@services/lookup.service';
import { Lookup } from '@models/lookup';

@Component({
  selector: 'app-mawared-employee-popup',
  templateUrl: './mawared-employee-popup.component.html',
  styleUrls: ['./mawared-employee-popup.component.scss'],
})
export class MawaredEmployeePopupComponent extends AdminDialogComponent<MawaredEmployee> {
  form!: UntypedFormGroup;
  data: CrudDialogDataContract<MawaredEmployee> = inject(MAT_DIALOG_DATA);

  private lookupService = inject(LookupService);
  genderTypes: Lookup[] = this.lookupService.lookups.gender;

  _buildForm(): void {
    this.form = this.fb.group(this.model.buildForm(true));
  }

  protected _beforeSave(): boolean | Observable<boolean> {
    this.form.markAllAsTouched();
    return this.form.valid;
  }

  protected _prepareModel(): MawaredEmployee | Observable<MawaredEmployee> {
    return new MawaredEmployee().clone<MawaredEmployee>({
      ...this.model,
      ...this.form.value,
    });
  }

  protected _afterSave(model: MawaredEmployee): void {
    this.model = model;
    this.operation = OperationType.UPDATE;
    this.toast.success(
      this.lang.map.msg_save_x_success.change({ x: this.model.getNames() })
    );
    // you can close the dialog after save here
    // this.dialogRef.close(this.model);
  }
}
