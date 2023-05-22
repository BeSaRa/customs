import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdministrationComponent } from './administration.component';
import { AppRoutes } from '@constants/app-routes';
import { LocalizationComponent } from '@modules/administration/components/localization/localization.component';
import { InternalUserComponent } from '@modules/administration/components/internal-user/internal-user.component';
import { TeamComponent } from '@modules/administration/components/team/team.component';
import { PenaltyComponent } from '@modules/administration/components/penalty/penalty.component';
import { ViolationClassificationComponent } from '@modules/administration/components/violation-classification/violation-classification.component';
import { ViolationTypeComponent } from '@modules/administration/components/violation-type/violation-type.component';
import { JobTitleComponent } from '@modules/administration/components/job-title/job-title.component';
import { PermissionRoleComponent } from '@modules/administration/components/permission-role/permission-role.component';
import { MawaredEmployeeComponent } from '@modules/administration/components/mawared-employee/mawared-employee.component';

const routes: Routes = [
  { path: '', component: AdministrationComponent },
  {
    path: AppRoutes.JOB_TITLE,
    component: JobTitleComponent,
  },
  {
    path: AppRoutes.LOCALIZATION,
    component: LocalizationComponent,
  },
  {
    path: AppRoutes.INTERNAL_USER,
    component: InternalUserComponent,
  },
  { path: AppRoutes.JOB_TITLE, component: JobTitleComponent },

  {
    path: AppRoutes.TEAM,
    component: TeamComponent,
  },
  {
    path: AppRoutes.PENALTY,
    component: PenaltyComponent,
  },
  {
    path: AppRoutes.TEAM,
    component: TeamComponent,
  },
  {
    path: AppRoutes.VIOLATION_CLASSIFICATION,
    component: ViolationClassificationComponent,
  },
  {
    path: AppRoutes.VIOLATION_TYPE,
    component: ViolationTypeComponent,
  },
  {
    path: AppRoutes.PERMISSION_ROLE,
    component: PermissionRoleComponent,
  },
  {
    path: AppRoutes.MAWARED_EMPLOYEE,
    component: MawaredEmployeeComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdministrationRoutingModule {}
