import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { EmployeeService } from '@services/employee.service';
import { AppPermissionsType } from '@constants/app-permissions';
import { DialogService } from '@services/dialog.service';
import { LangService } from '@services/lang.service';
import { LDAPGroupNames } from '@enums/department-group-names.enum';

export const accessPageGuard: (options?: {
  permission?: string | keyof AppPermissionsType;
  permissionGroup?: string[] | (keyof AppPermissionsType)[];
  permissionFromTeam?: LDAPGroupNames;
}) => CanActivateFn = options => {
  return () => {
    const employeeService = inject(EmployeeService);
    const dialog = inject(DialogService);
    const lang = inject(LangService);
    const canAccess = !options
      ? true
      : options.permission
        ? employeeService.hasPermissionTo(
            options.permission as keyof AppPermissionsType,
          )
        : options.permissionFromTeam
          ? employeeService.hasPermissionFromTeam(options.permissionFromTeam)
          : !!(
              options.permissionGroup &&
              employeeService.hasAnyPermissions(
                options.permissionGroup as unknown as (keyof AppPermissionsType)[],
              )
            );
    if (!canAccess) {
      dialog.error(lang.map.access_denied);
    }
    return canAccess;
  };
};
