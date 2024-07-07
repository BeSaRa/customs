import { Component, inject, OnInit } from '@angular/core';
import { ButtonComponent } from '@standalone/components/button/button.component';
import { ControlDirective } from '@standalone/directives/control.directive';
import { IconButtonComponent } from '@standalone/components/icon-button/icon-button.component';
import { InputComponent } from '@standalone/components/input/input.component';
import {
  MatDatepicker,
  MatDatepickerInput,
} from '@angular/material/datepicker';
import {
  MAT_DIALOG_DATA,
  MatDialogClose,
  MatDialogRef,
} from '@angular/material/dialog';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { LangService } from '@services/lang.service';
import { PermissionRole } from '@models/permission-role';
import {
  catchError,
  combineLatest,
  filter,
  map,
  Observable,
  of,
  tap,
} from 'rxjs';
import { PermissionRoleService } from '@services/permission-role.service';
import { CheckGroup } from '@models/check-group';
import { Permission } from '@models/permission';
import { PermissionService } from '@services/permission.service';
import { LookupService } from '@services/lookup.service';
import { SelectInputComponent } from '@standalone/components/select-input/select-input.component';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { AppIcons } from '@constants/app-icons';
import { FilterArrayPipe } from '@standalone/pipes/filter-array.pipe';
import { HighlightPipe } from '@standalone/directives/highlight.pipe';
import { CrudDialogDataContract } from '@contracts/crud-dialog-data-contract';
import { InternalUserOU } from '@models/internal-user-ou';
import { MatRipple } from '@angular/material/core';
import { OrganizationUnitService } from '@services/organization-unit.service';
import { OrganizationUnitType } from '@enums/organization-unit-type';

@Component({
  selector: 'app-internal-user-permissions-popup',
  standalone: true,
  imports: [
    ButtonComponent,
    ControlDirective,
    IconButtonComponent,
    InputComponent,
    MatDatepicker,
    MatDatepickerInput,
    MatDialogClose,
    ReactiveFormsModule,
    SelectInputComponent,
    MatCheckbox,
    MatIcon,
    MatTooltip,
    FilterArrayPipe,
    HighlightPipe,
    MatRipple,
  ],
  templateUrl: './internal-user-permissions-popup.component.html',
  styleUrl: './internal-user-permissions-popup.component.scss',
})
export class InternalUserPermissionsPopupComponent implements OnInit {
  ngOnInit(): void {
    this.loadPermissionsRoles();
    this.loadGroups();
    this.listenToPermissionRoleChange();
    this.loadOrganizationUnit();
  }

  lang = inject(LangService);
  permissionService = inject(PermissionService);
  organizationUnitService = inject(OrganizationUnitService);
  lookupService = inject(LookupService);
  data: CrudDialogDataContract<InternalUserOU> = inject(MAT_DIALOG_DATA);
  dialogRef = inject(MatDialogRef);
  permissionsRoles!: PermissionRole[];
  ouId = this.data.model.organizationUnitId;
  internalUserId = this.data.model.internalUserId;
  inViewMode = !!this.data.extras?.inViewMode;
  protected readonly AppIcons = AppIcons;

  private readonly permissionRoleService = inject(PermissionRoleService);
  permissionRoleId = new FormControl();
  selectedIds: number[] = [];
  groups: CheckGroup<Permission>[] = [];
  permissionsByGroup: Record<number, Permission[]> = {} as Record<
    number,
    Permission[]
  >;

  private loadPermissionsRoles() {
    this.permissionRoleService.loadAsLookups().subscribe(permissionsRoles => {
      this.permissionsRoles = permissionsRoles;
    });
  }

  private listenToPermissionRoleChange() {
    this.permissionRoleId?.valueChanges.subscribe(val => {
      const selectedRoleId = this.permissionsRoles.find(
        permission => permission.id === val,
      );
      this.selectedIds = selectedRoleId!.permissionSet.map(
        permission => permission.permissionId,
      );
      this.loadGroups();
    });
  }

  loadGroups() {
    this.load().subscribe(groups => {
      this.groups = groups;
    });
  }

  loadOrganizationUnit() {
    this.organizationUnitService
      .loadById(this.data.model.organizationUnitId)
      .subscribe(ou =>
        ou.parent && ou.type === OrganizationUnitType.SECTION
          ? this.loadUserPermissions(ou.parent)
          : this.loadUserPermissions(ou.id),
      );
  }

  private load(): Observable<CheckGroup<Permission>[]> {
    return combineLatest({
      permissions: this.permissionService.loadAsLookups(),
      groups: of(this.lookupService.lookups.permissionGroup),
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
        return groups.map(group => {
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

  private loadUserPermissions(id: number) {
    this.permissionService
      .loadUserPermissions(this.data.model.internalUserId)
      .subscribe(val => {
        const ids: number[] = [];
        val
          .filter(permission => permission.ouId === id)
          .forEach(permission => {
            ids.push(permission.permissionId);
          });
        this.selectedIds = ids;
        this.loadGroups();
      });
  }

  save() {
    const permissions = this.groups.map(g => g.getSelectedValue()).flat();
    this.permissionService
      .savePermissions(this.internalUserId, this.ouId, permissions)
      .pipe(
        catchError(() => of(null)),
        filter(response => response !== null),
      )
      .subscribe(() => this.dialogRef.close());
  }
}
