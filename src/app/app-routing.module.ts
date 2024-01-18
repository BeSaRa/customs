import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { authGuard } from '@guards/auth.guard';
import { HomeComponent } from './components/home/home.component';
import { AppRoutes } from '@constants/app-routes';

const routes: Routes = [
  { path: '', redirectTo: AppRoutes.LOGIN, pathMatch: 'full' },
  {
    path: AppRoutes.HOME,
    component: HomeComponent,
    canMatch: [authGuard('AUTH', AppRoutes.LOGIN)],
    children: [
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
    path: AppRoutes.LOGIN,
    component: LoginComponent,
    canMatch: [authGuard('GUEST', AppRoutes.HOME)],
  },
  { path: '**', redirectTo: 'errors' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
