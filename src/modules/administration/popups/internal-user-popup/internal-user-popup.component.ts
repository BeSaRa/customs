import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CrudDialogDataContract } from '@contracts/crud-dialog-data-contract';
import { InternalUser } from '@models/internal-user';
import { AdminDialogComponent } from '@abstracts/admin-dialog-component';
import { UntypedFormGroup } from '@angular/forms';
import {
  Observable,
  catchError,
  filter,
  of,
  takeUntil,
  withLatestFrom,
} from 'rxjs';
import { OperationType } from '@enums/operation-type';
import { Lookup } from '@models/lookup';
import { LookupService } from '@services/lookup.service';
import { PermissionService } from '@services/permission.service';
import { Permission } from '@models/permission';

@Component({
  selector: 'app-internal-user-popup',
  templateUrl: './internal-user-popup.component.html',
  styleUrls: ['./internal-user-popup.component.scss'],
})
export class InternalUserPopupComponent extends AdminDialogComponent<InternalUser> {
  form!: UntypedFormGroup;
  data: CrudDialogDataContract<InternalUser> = inject(MAT_DIALOG_DATA);
  private readonly lookupService = inject(LookupService);
  private readonly permissionService = inject(PermissionService);

  statusList!: Lookup[];
  allPermissions!: Permission[];

  _buildForm(): void {
    this.form = this.fb.group({
      ...this.model.buildForm(true),
      userPreferences: this.fb.group(this.model.buildUserPreferencesForm(true)),
      userPermissions: this.fb.group({
        permissions: [],
        customRoleId: [this.model?.customRoleId],
      }),
    });
    if (this.data.operation === OperationType.UPDATE) {
      this.loadUserPermissions(this.model);
    }
  }

  protected _beforeSave(): boolean | Observable<boolean> {
    this.form.markAllAsTouched();
    return this.form.valid;
  }

  protected _prepareModel(): InternalUser | Observable<InternalUser> {
    return new InternalUser().clone<InternalUser>({
      ...this.model,
      ...this.form.value,
    });
  }

  protected _afterSave(model: InternalUser): void {
    this.model = model;
    this.operation = OperationType.UPDATE;
    this.toast.success(
      this.lang.map.msg_save_x_success.change({ x: this.model.getNames() })
    );
    this.permissionService
      .savePermissions(model.id, this.userPermissions?.value)
      .pipe(
        catchError(() => of(null)),
        filter((response) => response !== null)
      )
      .subscribe();
    // you can close the dialog after save here
    this.dialogRef.close(this.model);
  }

  protected override _init(): void {
    this.statusList = this.lookupService.lookups.commonStatus;
    this.loadPermissions();
  }

  get permissionsFormTab() {
    return this.form.get('userPermissions');
  }

  get customRoleId() {
    return this.permissionsFormTab?.get('customRoleId');
  }

  get userPermissions() {
    return this.permissionsFormTab?.get('permissions');
  }

  get userPreferences() {
    return this.form.get('userPreferences');
  }

  get customRoleIdField() {
    return this.form.get('customRoleId');
  }

  private loadUserPermissions(model: InternalUser) {
    this.permissionService.loadPermissions(model?.id).subscribe((val) => {
      const ids: number[] = [];
      val.forEach((permission) => {
        ids.push(permission.permissionId);
      });
      this.userPermissions?.patchValue(ids);
    });
  }

  private loadPermissions() {
    this.permissionService
      .loadAsLookups()
      .pipe(takeUntil(this.destroy$))
      .pipe(withLatestFrom(of(this.lookupService.lookups.permissionCategory)))
      .subscribe((userPermissions) => {
        this.allPermissions = userPermissions[0];
      });
  }
}
