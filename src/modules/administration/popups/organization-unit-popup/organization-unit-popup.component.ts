import { OrganizationUnitService } from './../../../../services/organization-unit.service';
import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CrudDialogDataContract } from '@contracts/crud-dialog-data-contract';
import { OrganizationUnit } from '@models/organization-unit';
import { AdminDialogComponent } from '@abstracts/admin-dialog-component';
import { UntypedFormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { OperationType } from '@enums/operation-type';
import { Lookup } from '@models/lookup';
import { LookupService } from '@services/lookup.service';
import { InternalUserService } from '@services/internal-user.service';
import { InternalUser } from '@models/internal-user';

@Component({
  selector: 'app-organization-unit-popup',
  templateUrl: './organization-unit-popup.component.html',
  styleUrls: ['./organization-unit-popup.component.scss'],
})
export class OrganizationUnitPopupComponent extends AdminDialogComponent<OrganizationUnit> {
  form!: UntypedFormGroup;
  data: CrudDialogDataContract<OrganizationUnit> = inject(MAT_DIALOG_DATA);

  unitTypes: Lookup[] = inject(LookupService).lookups.organizationUniType;
  internalUserService = inject(InternalUserService);
  internalUsers!: InternalUser[];
  organizationUnitService = inject(OrganizationUnitService);
  organizationUnits!: OrganizationUnit[];

  protected override _initPopup(): void {
    super._initPopup();
    this.getInternalUsers();
    this.getOrganizationUnits();
  }

  _buildForm(): void {
    this.form = this.fb.group(this.model.buildForm(true));
  }

  protected _beforeSave(): boolean | Observable<boolean> {
    this.form.markAllAsTouched();
    return this.form.valid;
  }

  protected _prepareModel(): OrganizationUnit | Observable<OrganizationUnit> {
    return new OrganizationUnit().clone<OrganizationUnit>({
      ...this.model,
      ...this.form.value,
    });
  }

  protected _afterSave(model: OrganizationUnit): void {
    this.model = model;
    this.operation = OperationType.UPDATE;
    this.toast.success(this.lang.map.msg_save_x_success.change({ x: this.model.getNames() }));
    // you can close the dialog after save here
    this.dialogRef.close(this.model);
  }

  protected getInternalUsers() {
    this.internalUserService.loadAsLookups().subscribe(data => {
      this.internalUsers = data;
    });
  }

  protected getOrganizationUnits() {
    this.organizationUnitService.loadAsLookups().subscribe(data => {
      this.organizationUnits = data;
    });
  }
}
