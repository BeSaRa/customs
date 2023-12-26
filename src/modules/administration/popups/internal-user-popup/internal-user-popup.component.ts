import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CrudDialogDataContract } from '@contracts/crud-dialog-data-contract';
import { InternalUser } from '@models/internal-user';
import { AdminDialogComponent } from '@abstracts/admin-dialog-component';
import { UntypedFormGroup } from '@angular/forms';
import { Observable, catchError, combineLatest, filter, map, of, takeUntil, tap } from 'rxjs';
import { OperationType } from '@enums/operation-type';
import { Lookup } from '@models/lookup';
import { LookupService } from '@services/lookup.service';
import { PermissionService } from '@services/permission.service';
import { Permission } from '@models/permission';
import { PermissionRoleService } from '@services/permission-role.service';
import { PermissionRole } from '@models/permission-role';
import { CheckGroup } from '@models/check-group';
import { AppIcons } from '@constants/app-icons';
import { InternalUserService } from '@services/internal-user.service';
import { SafeResourceUrl } from '@angular/platform-browser';
import { DomSanitizer } from '@angular/platform-browser';
import { UserSignature } from '@models/user-signature';

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
  private readonly permissionRoleService = inject(PermissionRoleService);
  private readonly internalUserService = inject(InternalUserService);
  private readonly sanitizer = inject(DomSanitizer);
  Operations = OperationType;
  signatureSafeUrl: SafeResourceUrl | null = null;
  userSignature!: UserSignature;
  statusList!: Lookup[];
  permissionsRoles!: PermissionRole[];
  groups: CheckGroup<Permission>[] = [];
  selectedIds: number[] = [];
  permissionsByGroup: Record<number, Permission[]> = {} as Record<number, Permission[]>;

  protected readonly AppIcons = AppIcons;

  _buildForm(): void {
    this.form = this.fb.group({
      ...this.model.buildForm(true),
      userPreferences: this.fb.group(this.model.buildUserPreferencesForm(true)),
    });
    if (this.data.operation !== OperationType.CREATE) {
      this.loadUserPermissions(this.model);
    }
  }

  protected _beforeSave(): boolean | Observable<boolean> {
    this.form.markAllAsTouched();
    const hasSelected = this.groups.some(group => group.getSelectedValue().length);
    if (!hasSelected) {
      this.toast.error(
        this.lang.map.msg_select_one_at_least_x_to_proceed.change({
          x: this.lang.map.permission,
        })
      );
      return false;
    }
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
    this.toast.success(this.lang.map.msg_save_x_success.change({ x: this.model.getNames() }));
    const permissions = this.groups.map(g => g.getSelectedValue()).flat();
    this.permissionService
      .savePermissions(model.id, permissions)
      .pipe(
        catchError(() => of(null)),
        filter(response => response !== null)
      )
      .subscribe();
    this.internalUserService
      .uploadSignature(this.userSignature)
      .pipe(
        catchError(() => of(null)),
        filter(response => response !== null)
      )
      .subscribe();
    // you can close the dialog after save here
    this.dialogRef.close(this.model);
  }

  protected override _init(): void {
    this.statusList = this.lookupService.lookups.commonStatus;
    this.loadPermissionsRoles();
    this.loadGroups();
    this.getSignatureSafeURL();
  }

  private getSignatureSafeURL() {
    if (this.inCreateMode()) return;
    this.internalUserService.downloadSignature(this.model.id, this.sanitizer).subscribe(blob => {
      this.signatureSafeUrl = blob.safeUrl;
    });
  }

  private load(): Observable<CheckGroup<Permission>[]> {
    return combineLatest({
      permissions: this.permissionService.loadAsLookups(),
      groups: of(this.lookupService.lookups.permissionGroups),
    }).pipe(
      tap(({ permissions }) => {
        this.permissionsByGroup = permissions.reduce((acc, permission) => {
          return {
            ...acc,
            [permission.groupId]: [...(acc[permission.groupId] ? acc[permission.groupId].concat(permission) : [permission])],
          };
        }, {} as Record<number, Permission[]>);
      }),
      map(({ groups }) => {
        return groups.map(group => {
          return new CheckGroup<Permission>(group, this.permissionsByGroup[group.lookupKey] || [], this.selectedIds, 3);
        });
      })
    );
  }

  protected override _afterBuildForm(): void {
    this.listenToPermissionRoleChange();
  }

  get permissionRoleId() {
    return this.form.get('permissionRoleId');
  }

  get userPreferences() {
    return this.form.get('userPreferences');
  }

  private loadUserPermissions(model: InternalUser) {
    this.permissionService.loadUserPermissions(model?.id).subscribe(val => {
      const ids: number[] = [];
      val.forEach(permission => {
        ids.push(permission.permissionId);
      });
      this.selectedIds = ids;
      this.loadGroups();
    });
  }

  private loadPermissionsRoles() {
    this.permissionRoleService
      .loadAsLookups()
      .pipe(takeUntil(this.destroy$))
      .subscribe(permissionsRoles => {
        this.permissionsRoles = permissionsRoles;
      });
  }

  private listenToPermissionRoleChange() {
    this.permissionRoleId?.valueChanges.subscribe(val => {
      const selectedRoleId = this.permissionsRoles.find(permission => permission.id === val);
      const ids = selectedRoleId!.permissionSet.map(permission => permission.permissionId);
      this.selectedIds = ids;
      this.loadGroups();
    });
  }

  loadGroups() {
    this.load().subscribe(groups => {
      this.groups = groups;
    });
  }

  filesDropped($event: DragEvent) {
    $event.preventDefault();
    if (!$event.dataTransfer) return;
    if (!$event.dataTransfer.files) return;
    if (!$event.dataTransfer.files[0]) return;
    this.userSignature = new UserSignature(this.data.model.id, $event.dataTransfer.files[0]);
    const reader = new FileReader();
    reader.onload = (e: any) => {
      const blob = new Blob([e.target.result]);
      const url = window.URL.createObjectURL(blob);
      this.signatureSafeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
    };
    reader.readAsArrayBuffer(this.userSignature.content as File);
  }

  getSignatureStyle(): string {
    if (this.inEditMode()) return 'border-dashed border-primary/20 rounded border-4 w-full flex items-center justify-center h-96 bg-gray-200';
    if (this.inViewMode()) return 'rounded w-full flex items-center justify-center h-96';
    return '';
  }
}
