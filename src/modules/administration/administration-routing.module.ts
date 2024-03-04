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
import { OrganizationUnitComponent } from '@modules/administration/components/organization-unit/organization-unit.component';
import { MawaredDepartmentComponent } from '@modules/administration/components/mawared-department/mawared-department.component';
import { ServicesComponent } from '@modules/administration/components/services/services.component';
import { ServiceStepsComponent } from '@modules/administration/components/service-steps/service-steps.component';
import { EmailTemplateComponent } from '@modules/administration/components/email-template/email-template.component';
import { GlobalSettingComponent } from '@modules/administration/components/global-setting/global-setting.component';
import { ViolationPenaltyComponent } from '@modules/administration/components/violation-penalty/violation-penalty.component';
import { LegalRuleComponent } from '@modules/administration/components/legal-rule/legal-rule.component';
import { AttachmentTypeComponent } from '@modules/administration/components/attachment-type/attachment-type.component';
import { ClearingAgentComponent } from '@modules/administration/components/clearing-agent/clearing-agent.component';
import { ClearingAgencyComponent } from '@modules/administration/components/clearing-agency/clearing-agency.component';
import { SuspendedEmployeeComponent } from '@modules/administration/components/suspended-employee/suspended-employee.component';
import { accessPageGuard } from '@guards/access-page-guard';
import { AppPermissions } from '@constants/app-permissions';

const routes: Routes = [
  { path: '', component: AdministrationComponent },
  {
    path: AppRoutes.JOB_TITLE,
    component: JobTitleComponent,
    canActivate: [
      accessPageGuard({
        permissionGroup: [
          AppPermissions.ADMIN_ADD_OU,
          AppPermissions.ADMIN_EDIT_OU,
        ],
      }),
    ],
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
  {
    path: AppRoutes.ORGANIZATION_UNIT,
    component: OrganizationUnitComponent,
  },
  {
    path: AppRoutes.MAWARED_DEPARTMENT,
    component: MawaredDepartmentComponent,
  },
  {
    path: AppRoutes.SERVICES,
    component: ServicesComponent,
  },
  {
    path: AppRoutes.SERVICE_STEPS,
    component: ServiceStepsComponent,
  },
  {
    path: AppRoutes.EMAIL_TEMPLATE,
    component: EmailTemplateComponent,
  },
  {
    path: AppRoutes.GLOBAL_SETTING,
    component: GlobalSettingComponent,
  },
  {
    path: AppRoutes.VIOLATION_PENALTY,
    component: ViolationPenaltyComponent,
  },
  {
    path: AppRoutes.LEGAL_RULE,
    component: LegalRuleComponent,
  },
  {
    path: AppRoutes.ATTACHMENT_TYPE,
    component: AttachmentTypeComponent,
  },
  {
    path: AppRoutes.CLEARING_AGENT,
    component: ClearingAgentComponent,
  },
  {
    path: AppRoutes.CLEARING_AGENCY,
    component: ClearingAgencyComponent,
  },
  {
    path: AppRoutes.SUSPENDED_EMPLOYEE,
    component: SuspendedEmployeeComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdministrationRoutingModule {}
