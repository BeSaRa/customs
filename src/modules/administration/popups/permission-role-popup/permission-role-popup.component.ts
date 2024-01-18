import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CrudDialogDataContract } from '@contracts/crud-dialog-data-contract';
import { PermissionRole } from '@models/permission-role';
import { AdminDialogComponent } from '@abstracts/admin-dialog-component';
import { UntypedFormGroup } from '@angular/forms';
import { combineLatest, map, Observable, of, tap } from 'rxjs';
import { OperationType } from '@enums/operation-type';
import { PermissionService } from '@services/permission.service';
import { LookupService } from '@services/lookup.service';
import { CheckGroup } from '@models/check-group';
import { Permission } from '@models/permission';
import { AppIcons } from '@constants/app-icons';

@Component({
  selector: 'app-permission-role-popup',
  templateUrl: './permission-role-popup.component.html',
  styleUrls: ['./permission-role-popup.component.scss'],
})
export class PermissionRolePopupComponent extends AdminDialogComponent<PermissionRole> {
  form!: UntypedFormGroup;
  data: CrudDialogDataContract<PermissionRole> = inject(MAT_DIALOG_DATA);
  permissionService = inject(PermissionService);
  lookupService = inject(LookupService);
  permissionsByGroup: Record<number, Permission[]> = {} as Record<
    number,
    Permission[]
  >;
  groups: CheckGroup<Permission>[] = [];
  selectedIds: number[] = [];

  protected override _init() {
    this.selectedIds =
      this.model.permissionSet.map((i) => i.permissionId) || [];
    this.load().subscribe((groups) => {
      this.groups = groups;
    });
  }

  private load(): Observable<CheckGroup<Permission>[]> {
    return combineLatest({
      permissions: this.permissionService.loadAsLookups(),
      groups: of(this.lookupService.lookups.permissionGroups),
    }).pipe(
      tap(({ permissions }) => {
        this.permissionsByGroup = permissions.reduce(
          (acc, permission) => {
            return {
              ...acc,
              [permission.groupId]: [
                ...(acc[permission.groupId]
                  ? acc[permission.groupId].concat(permission)
                  : [permission]),
              ],
            };
          },
          {} as Record<number, Permission[]>,
        );
      }),
      map(({ groups }) => {
        return groups.map((group) => {
          return new CheckGroup<Permission>(
            group,
            this.permissionsByGroup[group.lookupKey] || [],
            this.selectedIds,
            3,
          );
        });
      }),
    );
  }

  _buildForm(): void {
    this.form = this.fb.group(this.model.buildForm(true));
  }

  protected _beforeSave(): boolean | Observable<boolean> {
    this.form.markAllAsTouched();
    const hasSelected = this.groups.some(
      (group) => group.getSelectedValue().length,
    );
    if (!hasSelected) {
      this.toast.error(
        this.lang.map.msg_select_one_at_least_x_to_proceed.change({
          x: this.lang.map.permission,
        }),
      );
      return false;
    }
    return this.form.valid;
  }

  protected _prepareModel(): PermissionRole | Observable<PermissionRole> {
    return new PermissionRole().clone<PermissionRole>({
      ...this.model,
      ...this.form.value,
      permissionSet: this.groups
        .map((g) => g.getSelectedValue())
        .flat()
        .map((i) => ({ permissionId: i })),
    });
  }

  protected _afterSave(model: PermissionRole): void {
    this.model = model;
    this.operation = OperationType.UPDATE;
    this.toast.success(
      this.lang.map.msg_save_x_success.change({ x: this.model.getNames() }),
    );
    // you can close the dialog after save here
    this.dialogRef.close(this.model);
  }

  protected readonly AppIcons = AppIcons;
}
