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
  },
  {
    id: MenuIdes.MAWARED_DEPARTMENT,
    langKey: 'menu_mawared_department',
    icon: AppIcons.MAWARED_DEPARTMENT,
    path: AppFullRoutes.MAWARED_DEPARTMENT,
    parent: MenuIdes.ADMINISTRATION,
  },
];
