import { AppPermissions } from '@constants/app-permissions';

export const AppPermissionsGroup = {
  ADMINISTRATION: [
    AppPermissions.MANAGE_LOCALIZATION,
    AppPermissions.MANAGE_INTERNAL_USERS,
    AppPermissions.MANAGE_TEAMS,
    AppPermissions.MANAGE_PENALTY,
    AppPermissions.MANAGE_JOB_TITLES,
    AppPermissions.MANAGE_VIOLATION_CLASSIFICATION,
    AppPermissions.MANAGE_VIOLATION_TYPE,
    AppPermissions.MANAGE_PERMISSION_ROLE,
    AppPermissions.MANAGE_ORGANIZATION_UNIT,
    // AppPermissions.MANAGE_SERVICES_DATA,
    AppPermissions.MANAGE_EMAIL_TEMPLATE,
    // AppPermissions.MANAGE_ATTACHMENT_TYPE,
    AppPermissions.MANAGE_MAWARED_EMPLOYEE,
    AppPermissions.MANAGE_MAWARED_DEPARTMENT,
    AppPermissions.MANAGE_CLEARING_AGENT,
    AppPermissions.MANAGE_CLEARING_AGENCY,
    AppPermissions.MANAGEMNT_SYSTEM_PREFRENCES,
    AppPermissions.MANAGE_SUSPENDED_EMPLOYEE,
    AppPermissions.MANAGE_MANAGER_DELEGATION,
    AppPermissions.MANAGE_USER_DELEGATION,
  ],

  DASHBOARD: [
    AppPermissions.MANAGE_LAYOUT,
    AppPermissions.MANAGE_WIDGET,
    AppPermissions.MANAGE_LAYOUT_WIDGET,
  ],
};

export type AppPermissionsGroupType = typeof AppPermissionsGroup;
