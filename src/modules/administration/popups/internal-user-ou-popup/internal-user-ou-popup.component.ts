import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CrudDialogDataContract } from '@contracts/crud-dialog-data-contract';
import { InternalUserOU } from '@models/internal-user-ou';
import { AdminDialogComponent } from '@abstracts/admin-dialog-component';
import { UntypedFormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { OperationType } from '@enums/operation-type';
import { OrganizationUnit } from '@models/organization-unit';
import { OrganizationUnitService } from '@services/organization-unit.service';
import { InternalUserOUService } from '@services/internal-user-ou.service';

@Component({
  selector: 'app-internal-user-ou-popup',
  templateUrl: './internal-user-ou-popup.component.html',
  styleUrls: ['./internal-user-ou-popup.component.scss'],
})
export class InternalUserOUPopupComponent extends AdminDialogComponent<InternalUserOU> {
  form!: UntypedFormGroup;
  data: CrudDialogDataContract<InternalUserOU> = inject(MAT_DIALOG_DATA);
  service = inject(InternalUserOUService);
  organizationUnits!: OrganizationUnit[];
  organizationUnitService = inject(OrganizationUnitService);
  override ngOnInit(): void {
    super.ngOnInit();
    this.organizationUnitService.loadAsLookups().subscribe(data => (this.organizationUnits = data));
  }
  _buildForm(): void {
    this.form = this.fb.group(this.model.buildForm(true));
    this.internalUserId?.setValue(this.data.extras?.internalUserId);
  }

  protected _beforeSave(): boolean | Observable<boolean> {
    this.form.markAllAsTouched();
    return this.form.valid;
  }

  protected _prepareModel(): InternalUserOU | Observable<InternalUserOU> {
    return new InternalUserOU().clone<InternalUserOU>({
      ...this.model,
      ...this.form.value,
    });
  }

  protected _afterSave(model: InternalUserOU): void {
    this.model = model;
    this.operation = OperationType.UPDATE;
    this.toast.success(this.lang.map.msg_save_x_success.change({ x: this.model.getNames() }));
    // you can close the dialog after save here
    this.dialogRef.close(this.model);
  }
  get internalUserId() {
    return this.form.get('internalUserId');
  }
  get organizationUnitArray() {
    return this.form.get('organizationUnitArray');
  }

  saveBulk() {
    let payloadArr: any[] = [];
    this.organizationUnitArray?.value.forEach((value: number) => {
      payloadArr.push({ internalUserId: this.internalUserId?.value, organizationUnitId: value, status: 1 });
    });
    this.service.createBulkFull(payloadArr).subscribe();
  }
}
