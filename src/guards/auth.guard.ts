import { CanMatchFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '@services/auth.service';

export const authGuard: (
  type: 'AUTH' | 'GUEST',
  whenFailRedirectTo?: string
) => CanMatchFn = (type, whenFailRedirectTo) => () => {
  const auth = inject(AuthService);
  const router = inject(Router);
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
