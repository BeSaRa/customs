import { CanMatchFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '@services/auth.service';

export const authGuard: (
  type: 'AUTH' | 'GUEST',
  redirectTo?: string
) => CanMatchFn = (type, redirectTo) => () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  if (!redirectTo)
    return type === 'AUTH' ? auth.isAuthenticated() : auth.isGuest();

  const tree = router.parseUrl(redirectTo);
  return type === 'AUTH'
    ? (() => {
        return auth.isAuthenticated() ? true : tree;
      })()
    : (() => {
        return auth.isGuest() ? true : tree;
      })();
};
