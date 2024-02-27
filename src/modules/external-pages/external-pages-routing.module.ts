import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExternalPagesComponent } from './external-pages.component';
import { AppFullRoutes } from '@constants/app-full-routes';
import { AttendanceComponent } from '@standalone/components/attendance/attendance.component';
import { ExternalHomeComponent } from '@modules/external-pages/components/standalone/external-home/external-home.component';
import { PenaltyDecisionForExternalUsersComponent } from '@standalone/components/penalty-decision-for-external-users/penalty-decision-for-external-users.component';
import { CasesForExternalUsersComponent } from '@standalone/components/cases-for-external-users/cases-for-external-users.component';

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
      {
        path: 'decisions',
        component: PenaltyDecisionForExternalUsersComponent,
      },
      {
        path: 'investigations',
        component: CasesForExternalUsersComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ExternalPagesRoutingModule {}
