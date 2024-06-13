import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { EmployeeService } from '@services/employee.service';
import { AppPermissionsType } from '@constants/app-permissions';
import { DialogService } from '@services/dialog.service';
import { LangService } from '@services/lang.service';
import { TeamNames } from '@enums/team-names';
import { AppFullRoutes } from '@constants/app-full-routes';

export const accessPageGuard: (
  options?: {
    permission?: string | keyof AppPermissionsType;
    permissionGroup?: string[] | (keyof AppPermissionsType)[];
    permissionFromTeam?: TeamNames;
  },
  navigateToMain?: boolean,
) => CanActivateFn = (options, navigateToMain) => {
  return () => {
    const employeeService = inject(EmployeeService);
    const dialog = inject(DialogService);
    const lang = inject(LangService);
    const router = inject(Router);
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
      if (navigateToMain) {
        router.navigateByUrl(AppFullRoutes.MAIN);
      } else dialog.error(lang.map.access_denied);
    }
    return canAccess;
  };
};
