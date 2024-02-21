import { CanMatchFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '@services/auth.service';
import { EmployeeService } from '@services/employee.service';
import { AppRoutes } from '@constants/app-routes';

export const authGuard: (
  type: 'AUTH' | 'GUEST' | 'UNKNOWN',
  whenFailRedirectTo?: string,
) => CanMatchFn = (type, whenFailRedirectTo) => () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const employeeService = inject(EmployeeService);
  if (type === 'UNKNOWN') {
    whenFailRedirectTo = employeeService.getLoginData()?.person
      ? AppRoutes.EXTERNAL_PAGES
      : AppRoutes.HOME;
  }
  if (!whenFailRedirectTo)
    return type === 'AUTH' ? auth.isAuthenticated() : auth.isGuest();

  const tree = router.parseUrl(whenFailRedirectTo);
  return type === 'AUTH'
    ? (() => {
        return auth.isAuthenticated() ? true : tree;
      })()
    : (() => {
        return auth.isGuest() ? true : tree;
      })();
};
