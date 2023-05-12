import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CrudDialogDataContract } from '@contracts/crud-dialog-data-contract';
import { ViolationType } from '@models/violation-type';
import { AdminDialogComponent } from '@abstracts/admin-dialog-component';
import { UntypedFormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { OperationType } from '@enums/operation-type';
import { LookupService } from '@services/lookup.service';
import { LangService } from '@services/lang.service';
import { LangCodes } from '@enums/lang-codes';
import { ViolationClassificationService } from '@services/violation-classification.service';
import { MatSelectChange } from '@angular/material/select';
import { Lookup } from '@models/lookup';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';

@Component({
  selector: 'app-violation-type-popup',
  templateUrl: './violation-type-popup.component.html',
  styleUrls: ['./violation-type-popup.component.scss'],
})
export class ViolationTypePopupComponent extends AdminDialogComponent<ViolationType> {
  form!: UntypedFormGroup;
  data: CrudDialogDataContract<ViolationType> = inject(MAT_DIALOG_DATA);
  types: Lookup[] = inject(LookupService).lookups.penaltyType;
  penaltyTypes!: any[];
  isArabic = inject(LangService).getCurrent().code === LangCodes.AR;
  violationClassificationService = inject(ViolationClassificationService);
  classifications!: any[];
  allclassifications!: any[];
  cuurrentStatus!: boolean;
  isLoading = true;
  _buildForm(): void {
    this.cuurrentStatus = this.model ? this.model.isActive() : false;

    this.penaltyTypes = this.types.map((type) => {
      return { id: type.lookupKey, arName: type.arName, enName: type.enName };
    });
    this.violationClassificationService.loadAsLookups().subscribe((data) => {
      this.allclassifications = data;
      this.classifications =
        this.operation === 'CREATE'
          ? data
          : data.filter((classification) => {
              return !this.model.penaltyType
                ? true
                : classification.penaltyType === this.model.penaltyType;
            });
      this.isLoading = false;
    });
    this.form = this.fb.group(this.model.buildForm(true));
  }

  protected _beforeSave(): boolean | Observable<boolean> {
    this.form.markAllAsTouched();
    return this.form.valid;
  }

  protected _prepareModel(): ViolationType | Observable<ViolationType> {
    return new ViolationType().clone<ViolationType>({
      ...this.model,
      ...this.form.value,
      status: this.cuurrentStatus ? 1 : 0,
    });
  }

  protected _afterSave(model: ViolationType): void {
    this.model = model;
    this.operation = OperationType.UPDATE;
    this.toast.success(
      this.lang.map.msg_save_x_success.change({ x: this.model.getNames() })
    );
    // you can close the dialog after save here
    this.dialogRef.close(this.model);
  }
  onPenaltyTypeChange(PenaltyType: MatSelectChange) {
    this.classifications = this.allclassifications.filter((classification) => {
      return classification.penaltyType === PenaltyType;
    });
  }
  onChangeStatus(value: MatSlideToggleChange) {
    const isChecked = value.checked;
    this.cuurrentStatus = isChecked;
  }
}
