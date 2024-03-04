import { AppPermissions } from '@constants/app-permissions';

export const AppPermissionsGroup = {
  ADMINISTRATION: [
    AppPermissions.MANAGE_JOB_TITLES,
    AppPermissions.MANAGE_LOCALIZATION,
  ],
};

export type AppPermissionsGroupType = typeof AppPermissionsGroup;
