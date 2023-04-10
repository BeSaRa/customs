import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { authGuard } from '@guards/auth.guard';
import { HomeComponent } from './components/home/home.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'home',
    component: HomeComponent,
    canMatch: [authGuard('AUTH', 'login')],
  },
  {
    path: 'login',
    component: LoginComponent,
    canMatch: [authGuard('GUEST', 'home')],
  },
  {
    path: 'administration',
    loadChildren: () =>
      import('../modules/administration/administration.module').then(
        (m) => m.AdministrationModule
      ),
  },
  { path: '**', redirectTo: 'errors' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
