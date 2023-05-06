import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CrudDialogDataContract } from '@contracts/crud-dialog-data-contract';
import { Penalty } from '@models/penalty';
import { AdminDialogComponent } from '@abstracts/admin-dialog-component';
import { UntypedFormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { OperationType } from '@enums/operation-type';
import { LangCodes } from '@enums/lang-codes';
import { LookupService } from '@services/lookup.service';
import { Lookup } from '@models/lookup';
import { StatusTypes } from '@enums/status-types';

@Component({
  selector: 'app-penalty-popup',
  templateUrl: './penalty-popup.component.html',
  styleUrls: ['./penalty-popup.component.scss'],
})
export class PenaltyPopupComponent extends AdminDialogComponent<Penalty> {
  lookupService = inject(LookupService);

  form!: UntypedFormGroup;
  data: CrudDialogDataContract<Penalty> = inject(MAT_DIALOG_DATA);

  penaltyTypes: { name: string; lookupKey: number }[] =
    this.getTodisplayPenaltyTypes();

  _buildForm(): void {
    this.form = this.fb.group(this.model.buildForm(true));
  }

  protected _beforeSave(): boolean | Observable<boolean> {
    this.form.markAllAsTouched();
    return this.form.valid;
  }

  protected _prepareModel(): Penalty | Observable<Penalty> {
    return new Penalty().clone<Penalty>({
      ...this.model,
      ...this.form.value,
      status: this.form.value.status
        ? StatusTypes.ACTIVE
        : StatusTypes.INACTIVE,
    });
  }

  protected _afterSave(model: Penalty): void {
    this.model = model;
    this.operation = OperationType.UPDATE;
    this.toast.success(
      this.lang.map.msg_save_x_success.change({ x: this.model.getNames() })
    );
    // you can close the dialog after save here
    // this.dialogRef.close(this.model);
  }

  getTodisplayPenaltyTypes(): { name: string; lookupKey: number }[] {
    const penaltyTypes: Lookup[] = this.lookupService.lookups.penaltyType;
    return penaltyTypes
      .filter((t) => t.status)
      .map((t) => {
        return {
          name:
            this.lang.getCurrent().code === LangCodes.AR ? t.arName : t.enName,
          lookupKey: t.lookupKey,
        };
      });
  }
}
