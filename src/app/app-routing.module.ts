import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { authGuard } from '@guards/auth.guard';
import { HomeComponent } from './components/home/home.component';
import { AppRoutes } from '@constants/app-routes';
import { ExternalLoginComponent } from './components/external-login/external-login.component';

const routes: Routes = [
  { path: '', redirectTo: AppRoutes.LOGIN, pathMatch: 'full' },
  {
    path: AppRoutes.HOME,
    component: HomeComponent,
    canMatch: [authGuard('AUTH', AppRoutes.LOGIN)],
    children: [
      {
        path: '',
        redirectTo: AppRoutes.MAIN,
        pathMatch: 'full',
      },
      {
        path: AppRoutes.MAIN,
        loadComponent: () =>
          import('@standalone/components/main/main.component'),
      },
      {
        path: AppRoutes.ADMINISTRATION,
        loadChildren: () =>
          import('@modules/administration/administration.module').then(
            m => m.AdministrationModule,
          ),
      },
      {
        path: AppRoutes.ELECTRONIC_SERVICES,
        loadChildren: () =>
          import(
            '@modules/electronic-services/electronic-services.module'
          ).then(m => m.ElectronicServicesModule),
      },
    ],
  },
  {
    path: AppRoutes.EXTERNAL_PAGES,
    loadChildren: () =>
      import('@modules/external-pages/external-pages.module').then(
        m => m.ExternalPagesModule,
      ),
    canMatch: [authGuard('AUTH', AppRoutes.EXTERNAL_LOGIN)],
  },
  {
    path: AppRoutes.LOGIN,
    component: LoginComponent,
    canMatch: [
      authGuard('UNKNOWN'),
      // will set 'whenFailRedirectTo' inside authGuard
    ],
  },
  {
    path: AppRoutes.EXTERNAL_LOGIN,
    component: ExternalLoginComponent,
    canMatch: [authGuard('GUEST', AppRoutes.EXTERNAL_PAGES)],
  },
  {
    path: '**',
    redirectTo: 'errors',
  },
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      useHash: true,
      bindToComponentInputs: true,
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
