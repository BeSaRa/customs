import { Component, inject } from "@angular/core";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { CrudDialogDataContract } from "@contracts/crud-dialog-data-contract";
import { MawaredDepartment } from "@models/mawared-department";
import { AdminDialogComponent } from "@abstracts/admin-dialog-component";
import { UntypedFormGroup } from "@angular/forms";
import { Observable } from "rxjs";

@Component({
  selector: "app-mawared-department-popup",
  templateUrl: "./mawared-department-popup.component.html",
  styleUrls: ["./mawared-department-popup.component.scss"],
})
export class MawaredDepartmentPopupComponent extends AdminDialogComponent<MawaredDepartment> {
  form!: UntypedFormGroup;
  data: CrudDialogDataContract<MawaredDepartment> = inject(MAT_DIALOG_DATA);

  _buildForm(): void {
    this.form = this.fb.group(this.model.buildForm());
  }

  protected _beforeSave(): boolean | Observable<boolean> {
    return false;
  }

  protected _prepareModel(): MawaredDepartment | Observable<MawaredDepartment> {
    return new MawaredDepartment().clone<MawaredDepartment>({
      ...this.model,
    });
  }

  protected _afterSave(_model: MawaredDepartment): void {
    return;
  }
}
