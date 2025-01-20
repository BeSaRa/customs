import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { IS_IDLE } from '@http-contexts/tokens';
import { IdleService } from '@services/idle.service';

export const idleInterceptor: HttpInterceptorFn = (req, next) => {
  const _idleService = inject(IdleService);
  const _isIdle = req.context.get(IS_IDLE);
  if (!_isIdle) {
    _idleService.setIdleInterval();
  }
  return next(req);
};
