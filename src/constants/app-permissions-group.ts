import { AppPermissions } from '@constants/app-permissions';

export const AppPermissionsGroup = {
  ADMINISTRATION: [
    AppPermissions.MANAGE_LOCALIZATION,
    // Internal User Group
    AppPermissions.MANAGE_INTERNAL_USERS,
    // Internal User Group
    AppPermissions.MANAGE_TEAMS,
    AppPermissions.MANAGE_PENALTY,
    AppPermissions.MANAGE_JOB_TITLES,
    AppPermissions.MANAGE_VIOLATION_CLASSIFICATION,
    AppPermissions.MANAGE_VIOLATION_TYPE,
    AppPermissions.MANAGE_PERMISSION_ROLE,
    // ou Group
    AppPermissions.MANAGE_ORGANIZATION_UNIT,
    // ou Group
    AppPermissions.MANAGE_SERVICES_DATA,
    AppPermissions.MANAGE_EMAIL_TEMPLATE,
    AppPermissions.MANAGE_ATTACHMENT_TYPE,
    AppPermissions.MANAGE_MAWARED_EMPLOYEE,
    AppPermissions.MANAGE_MAWARED_DEPARTMENT,
    AppPermissions.MANAGE_CLEARING_AGENT,
    AppPermissions.MANAGE_CLEARING_AGENCY,
    //TODO add permission for global settings
    AppPermissions.MANAGE_SUSPENDED_EMPLOYEE,
  ],
  MNG_INTERNAL_USER: [AppPermissions.MANAGE_INTERNAL_USERS],
  MNG_OU: [AppPermissions.MANAGE_ORGANIZATION_UNIT],

  ELECTRONICSERVICES: [AppPermissions.INBOX_FOLLOW_UP],
};

export type AppPermissionsGroupType = typeof AppPermissionsGroup;
