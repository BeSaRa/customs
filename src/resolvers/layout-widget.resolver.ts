import { inject } from '@angular/core';
import { ResolveFn, Router } from '@angular/router';
import { AppFullRoutes } from '@constants/app-full-routes';
import { LayoutService } from '@services/layout.service';
import { WidgetService } from '@services/widget.service';
import { catchError, forkJoin, of } from 'rxjs';

export const layoutWidgetResolver: ResolveFn<unknown> = () => {
  const widgetService = inject(WidgetService);
  const layoutService = inject(LayoutService);
  const router = inject(Router);

  return forkJoin([widgetService.load(), layoutService.load()]).pipe(
    catchError(() => {
      router.navigateByUrl(AppFullRoutes.MAIN);
      return of([]);
    }),
  );
};
