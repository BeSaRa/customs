import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserServicesComponent } from './userServices.component';
import { AppRoutes } from '@constants/app-routes';
import { UserInboxComponent } from './user-inbox/user-inbox.component';

const routes: Routes = [
  { path: '', component: UserServicesComponent },
  {
    path: AppRoutes.USER_INBOX,
    component: UserInboxComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserServicesRoutingModule {}
