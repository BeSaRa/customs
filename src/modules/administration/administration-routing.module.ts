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
import { EmailTemplateComponent } from '@modules/administration/components/email-template/email-template.component';
import { GlobalSettingComponent } from '@modules/administration/components/global-setting/global-setting.component';
import { ViolationPenaltyComponent } from '@modules/administration/components/violation-penalty/violation-penalty.component';
import { LegalRuleComponent } from '@modules/administration/components/legal-rule/legal-rule.component';
import { ClearingAgentComponent } from '@modules/administration/components/clearing-agent/clearing-agent.component';
import { ClearingAgencyComponent } from '@modules/administration/components/clearing-agency/clearing-agency.component';
import { SuspendedEmployeeComponent } from '@modules/administration/components/suspended-employee/suspended-employee.component';
import { accessPageGuard } from '@guards/access-page-guard';
import { AppPermissions } from '@constants/app-permissions';
import { ManagerDelegationComponent } from '@modules/administration/components/manager-delegation/manager-delegation.component';
import { CustomMenuComponent } from '@modules/administration/components/custom-menu/custom-menu.component';
import { UserGuideComponent } from '@modules/administration/components/user-guide/user-guide.component';
import { UserDelegationComponent } from '@modules/administration/components/user-delegation/user-delegation.component';

const routes: Routes = [
  { path: '', component: AdministrationComponent },
  {
    path: AppRoutes.JOB_TITLE,
    component: JobTitleComponent,
    canActivate: [
      accessPageGuard({
        permission: AppPermissions.MANAGE_JOB_TITLES,
      }),
    ],
  },
  {
    path: AppRoutes.LOCALIZATION,
    component: LocalizationComponent,
    canActivate: [
      accessPageGuard({
        permission: AppPermissions.MANAGE_LOCALIZATION,
      }),
    ],
  },
  {
    path: AppRoutes.INTERNAL_USER,
    component: InternalUserComponent,
    canActivate: [
      accessPageGuard({
        permission: AppPermissions.MANAGE_INTERNAL_USERS,
      }),
    ],
  },
  {
    path: AppRoutes.TEAM,
    component: TeamComponent,
    canActivate: [
      accessPageGuard({
        permission: AppPermissions.MANAGE_TEAMS,
      }),
    ],
  },
  {
    path: AppRoutes.PENALTY,
    component: PenaltyComponent,
    canActivate: [
      accessPageGuard({
        permission: AppPermissions.MANAGE_PENALTY,
      }),
    ],
  },
  {
    path: AppRoutes.TEAM,
    component: TeamComponent,
    canActivate: [
      accessPageGuard({
        permission: AppPermissions.MANAGE_TEAMS,
      }),
    ],
  },
  {
    path: AppRoutes.VIOLATION_CLASSIFICATION,
    component: ViolationClassificationComponent,
    canActivate: [
      accessPageGuard({
        permission: AppPermissions.MANAGE_VIOLATION_CLASSIFICATION,
      }),
    ],
  },
  {
    path: AppRoutes.VIOLATION_TYPE,
    component: ViolationTypeComponent,
    canActivate: [
      accessPageGuard({
        permission: AppPermissions.MANAGE_VIOLATION_TYPE,
      }),
    ],
  },
  {
    path: AppRoutes.PERMISSION_ROLE,
    component: PermissionRoleComponent,
    canActivate: [
      accessPageGuard({
        permission: AppPermissions.MANAGE_PERMISSION_ROLE,
      }),
    ],
  },
  {
    path: AppRoutes.MAWARED_EMPLOYEE,
    component: MawaredEmployeeComponent,
    canActivate: [
      accessPageGuard({
        permission: AppPermissions.MANAGE_MAWARED_EMPLOYEE,
      }),
    ],
  },
  {
    path: AppRoutes.ORGANIZATION_UNIT,
    component: OrganizationUnitComponent,
    canActivate: [
      accessPageGuard({
        permission: AppPermissions.MANAGE_ORGANIZATION_UNIT,
      }),
    ],
  },
  {
    path: AppRoutes.MAWARED_DEPARTMENT,
    component: MawaredDepartmentComponent,
    canActivate: [
      accessPageGuard({
        permission: AppPermissions.MANAGE_MAWARED_DEPARTMENT,
      }),
    ],
  },
  // comment it until we make sure that there is no need for it
  // {
  //   path: AppRoutes.SERVICES,
  //   component: ServicesComponent,
  //   canActivate: [
  //     accessPageGuard({
  //       permission: AppPermissions.MANAGE_SERVICES_DATA,
  //     }),
  //   ],
  // },
  // comment it until we make sure that there is no need for it
  // {
  //   path: AppRoutes.SERVICE_STEPS,
  //   component: ServiceStepsComponent,
  //   canActivate: [
  //     accessPageGuard({
  //       permission: AppPermissions.MANAGE_SERVICES_DATA,
  //     }),
  //   ],
  // },
  {
    path: AppRoutes.EMAIL_TEMPLATE,
    component: EmailTemplateComponent,
    canActivate: [
      accessPageGuard({
        permission: AppPermissions.MANAGE_EMAIL_TEMPLATE,
      }),
    ],
  },
  {
    path: AppRoutes.GLOBAL_SETTING,
    component: GlobalSettingComponent,
    canActivate: [
      accessPageGuard({
        permission: AppPermissions.MANAGEMNT_SYSTEM_PREFRENCES,
      }),
    ],
  },
  {
    path: AppRoutes.VIOLATION_PENALTY,
    component: ViolationPenaltyComponent,
    canActivate: [
      accessPageGuard({
        permission: AppPermissions.MANAGE_VIOLATION_TYPE,
      }),
    ],
  },
  {
    path: AppRoutes.LEGAL_RULE,
    component: LegalRuleComponent,
    canActivate: [
      accessPageGuard({
        permission: AppPermissions.MANAGE_LEGAL_RULE,
      }),
    ],
  },
  // comment it until we make sure that there is no need for it
  // {
  //   path: AppRoutes.ATTACHMENT_TYPE,
  //   component: AttachmentTypeComponent,
  //   canActivate: [
  //     accessPageGuard({
  //       permission: AppPermissions.MANAGE_ATTACHMENT_TYPE,
  //     }),
  //   ],
  // },
  {
    path: AppRoutes.CLEARING_AGENT,
    component: ClearingAgentComponent,
    canActivate: [
      accessPageGuard({
        permission: AppPermissions.MANAGE_CLEARING_AGENT,
      }),
    ],
  },
  {
    path: AppRoutes.CLEARING_AGENCY,
    component: ClearingAgencyComponent,
    canActivate: [
      accessPageGuard({
        permission: AppPermissions.MANAGE_CLEARING_AGENCY,
      }),
    ],
  },
  {
    path: AppRoutes.SUSPENDED_EMPLOYEE,
    component: SuspendedEmployeeComponent,
    canActivate: [
      accessPageGuard({
        permission: AppPermissions.MANAGE_SUSPENDED_EMPLOYEE,
      }),
    ],
  },
  {
    path: AppRoutes.MANAGER_DELEGATION,
    component: ManagerDelegationComponent,
    canActivate: [
      accessPageGuard({
        permission: AppPermissions.MANAGE_MANAGER_DELEGATION,
      }),
    ],
  },
  {
    path: AppRoutes.CUSTOM_MENU,
    component: CustomMenuComponent,
  },
  {
    path: AppRoutes.USER_GUIDE,
    component: UserGuideComponent,
  },
  {
    path: AppRoutes.USER_DELEGATION,
    component: UserDelegationComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdministrationRoutingModule {}
