import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExternalPagesComponent } from './external-pages.component';
import { AppFullRoutes } from '@constants/app-full-routes';
import { AttendanceComponent } from '@standalone/components/attendance/attendance.component';
import { ExternalHomeComponent } from '@modules/external-pages/components/standalone/external-home/external-home.component';

const routes: Routes = [
  {
    path: '',
    component: ExternalPagesComponent,
    children: [
      {
        path: '',
        redirectTo: AppFullRoutes.EXTERNAL_HOME,
        pathMatch: 'full',
      },
      {
        path: 'home',
        component: ExternalHomeComponent,
      },
      {
        path: 'summons-to-attend',
        component: AttendanceComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ExternalPagesRoutingModule {}
