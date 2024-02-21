import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExternalPagesComponent } from './external-pages.component';
import { AppRoutes } from '@constants/app-routes';
import { AppFullRoutes } from '@constants/app-full-routes';

const routes: Routes = [
  {
    path: '',
    component: ExternalPagesComponent,
    children: [
      {
        path: '',
        redirectTo: AppFullRoutes.EXTERNAL_MAIN,
        pathMatch: 'full',
      },
      {
        path: AppRoutes.HOME,
        loadComponent: () =>
          import(
            '@standalone/components/external-main/external-main.component'
          ),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ExternalPagesRoutingModule {}
