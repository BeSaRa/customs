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
    icon: AppIcons.SETTINGS,
    path: AppFullRoutes.INTERNAL_USER,
    parent: MenuIdes.ADMINISTRATION,
  },
  {
    id: MenuIdes.PENALTY,
    langKey: 'menu_penalty',
    icon: AppIcons.SETTINGS,
    path: AppFullRoutes.PENALTY,
    parent: MenuIdes.ADMINISTRATION,
  },
  {
    id: MenuIdes.JOB_TITLE,
    langKey: 'menu_job_title',
    icon: AppIcons.SETTINGS,
    path: AppFullRoutes.JOB_TITLE,
    parent: MenuIdes.ADMINISTRATION,
  },
  {
    id: MenuIdes.VIOLATION_CLASSIFICATION,
    langKey: 'menu_violation_classification',
    icon: AppIcons.SETTINGS,
    path: AppFullRoutes.VIOLATION_CLASSIFICATION,
    parent: MenuIdes.ADMINISTRATION,
  },
  {
    id: MenuIdes.VIOLATION_TYPE,
    langKey: 'menu_violation_type',
    icon: AppIcons.SETTINGS,
    path: AppFullRoutes.VIOLATION_TYPE,
    parent: MenuIdes.ADMINISTRATION,
  },
];
