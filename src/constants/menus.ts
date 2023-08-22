import { MenuItemContract } from '@contracts/menu-item-contract';
import { AppIcons } from '@constants/app-icons';
import { AppFullRoutes } from '@constants/app-full-routes';
import { MenuIdes } from '@constants/menu-ides';

export const Menus: MenuItemContract[] = [
  {
    id: MenuIdes.ADMINISTRATION,
    langKey: 'menu_administration',
    icon: AppIcons.SETTINGS,
    path: AppFullRoutes.ADMINISTRATION,
  },
  {
    id: MenuIdes.USER_SERVICES,
    langKey: 'menu_user_services',
    icon: AppIcons.USER_SERVICES,
    path: AppFullRoutes.USERSERVICES,
  },
  {
    id: MenuIdes.USER_INBOX,
    langKey: 'menu_user_inbox',
    icon: AppIcons.USER_INBOX,
    path: AppFullRoutes.USER_INBOX,
    parent: MenuIdes.USER_SERVICES,
  },
  {
    id: MenuIdes.LOCALIZATION,
    langKey: 'menu_localization',
    icon: AppIcons.TRANSLATE,
    path: AppFullRoutes.LOCALIZATION,
    parent: MenuIdes.ADMINISTRATION,
  },
  {
    id: MenuIdes.INTERNAL_USER,
    langKey: 'menu_internal_user',
    icon: AppIcons.INTERNAL_USER,
    path: AppFullRoutes.INTERNAL_USER,
    parent: MenuIdes.ADMINISTRATION,
  },
  {
    id: MenuIdes.TEAM,
    langKey: 'menu_team',
    icon: AppIcons.TEAM,
    path: AppFullRoutes.TEAM,
    parent: MenuIdes.ADMINISTRATION,
  },
  {
    id: MenuIdes.PENALTY,
    langKey: 'menu_penalty',
    icon: AppIcons.PENALTY,
    path: AppFullRoutes.PENALTY,
    parent: MenuIdes.ADMINISTRATION,
  },
  {
    id: MenuIdes.JOB_TITLE,
    langKey: 'menu_job_title',
    icon: AppIcons.JOB_TITLE,
    path: AppFullRoutes.JOB_TITLE,
    parent: MenuIdes.ADMINISTRATION,
  },
  {
    id: MenuIdes.VIOLATION_CLASSIFICATION,
    langKey: 'menu_violation_classification',
    icon: AppIcons.BOOK_CANCEL,
    path: AppFullRoutes.VIOLATION_CLASSIFICATION,
    parent: MenuIdes.ADMINISTRATION,
  },
  {
    id: MenuIdes.VIOLATION_TYPE,
    langKey: 'menu_violation_type',
    icon: AppIcons.BOOK_CANCEL_OUTLINE,
    path: AppFullRoutes.VIOLATION_TYPE,
    parent: MenuIdes.ADMINISTRATION,
  },
  {
    id: MenuIdes.PERMISSION_ROLE,
    langKey: 'menu_permission_role',
    icon: AppIcons.PERMISSIONS_LIST,
    path: AppFullRoutes.PERMISSION_ROLE,
    parent: MenuIdes.ADMINISTRATION,
  },
  {
    id: MenuIdes.MAWARED_EMPLOYEE,
    langKey: 'menu_mawared_employee',
    icon: AppIcons.RESOURCES_CASE,
    path: AppFullRoutes.MAWARED_EMPLOYEE,
    parent: MenuIdes.ADMINISTRATION,
  },
  {
    id: MenuIdes.BROKER_COMPANY,
    langKey: 'menu_broker_company',
    icon: AppIcons.BROKER_COMPANY,
    path: AppFullRoutes.BROKER_COMPANY,
    parent: MenuIdes.ADMINISTRATION,
  },
  {
    id: MenuIdes.ORGANIZATION_UNIT,
    langKey: 'menu_organization_unit',
    icon: AppIcons.SITE_MAP_OUTLINE,
    path: AppFullRoutes.ORGANIZATION_UNIT,
    parent: MenuIdes.ADMINISTRATION,
  },
  {
    id: MenuIdes.MAWARED_DEPARTMENT,
    langKey: 'menu_mawared_department',
    icon: AppIcons.MAWARED_DEPARTMENT,
    path: AppFullRoutes.MAWARED_DEPARTMENT,
    parent: MenuIdes.ADMINISTRATION,
  },
  {
    id: MenuIdes.BROKER,
    langKey: 'menu_broker',
    icon: AppIcons.BROKER,
    path: AppFullRoutes.BROKER,
    parent: MenuIdes.ADMINISTRATION,
  },
  {
    id: MenuIdes.SERVICES,
    langKey: 'menu_services',
    icon: AppIcons.SERVICES,
    parent: MenuIdes.ADMINISTRATION,
    path: AppFullRoutes.SERVICES,
  },
  {
    id: MenuIdes.EMAIL_TEMPLATE,
    langKey: 'menu_email_template',
    icon: AppIcons.EMAIL_TEMPLATE,
    parent: MenuIdes.ADMINISTRATION,
    path: AppFullRoutes.EMAIL_TEMPLATE,
  },
  {
    id: MenuIdes.GLOBAL_SETTING,
    langKey: 'menu_global_setting',
    icon: AppIcons.GLOBAL_SETTING,
    path: AppFullRoutes.GLOBAL_SETTING,
    parent: MenuIdes.ADMINISTRATION,
  },
  {
    id: MenuIdes.ELECTRONIC_SERVICES,
    langKey: 'menu_electronic_services',
    icon: AppIcons.ELECTRONIC_SERVICES,
    path: AppFullRoutes.ELECTRONIC_SERVICES,
  },
  {
    id: MenuIdes.INVESTIGATION,
    langKey: 'menu_investigation',
    icon: AppIcons.INVESTIGATION,
    path: AppFullRoutes.INVESTIGATION,
    parent: MenuIdes.ELECTRONIC_SERVICES,
  },
];
