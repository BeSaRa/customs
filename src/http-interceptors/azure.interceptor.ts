import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { ConfigService } from '@services/config.service';

export const azureInterceptor: HttpInterceptorFn = (req, next) => {
  const config = inject(ConfigService);

  if (req.url.indexOf(config.AZURE_BASE_URL) >= 0) {
    req = req.clone({
      setHeaders: {
        'x-functions-key': config.CONFIG.AZURE_X_FUNCTION_KEY,
        'Ocp-Apim-Subscription-Key': config.CONFIG.OCP_APIM_SUBSCRIPTION_KEY,
      },
    });
  }
  return next(req);
};
