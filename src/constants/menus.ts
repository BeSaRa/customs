import { MenuItemContract } from '@contracts/menu-item-contract';
import { AppIcons } from '@enums/app-icons';

export const Menus: MenuItemContract[] = [
  {
    id: 1,
    langKey: 'arabic_name',
    icon: AppIcons.DOMAIN,
    path: '/home',
  },
  {
    id: 2,
    langKey: 'login',
    permission: 'MANAGE_LOCALIZATION',
    icon: AppIcons.RELOAD,
    parent: 1,
  },
  {
    id: 3,
    langKey: 'login',
    permission: 'MANAGE_LOCALIZATION',
    icon: AppIcons.WRENCH_CLOCK,
  },
  {
    id: 5,
    langKey: 'login',
    permission: 'MANAGE_LOCALIZATION',
    icon: AppIcons.WRENCH_CLOCK,
    parent: 4,
  },
  {
    id: 4,
    langKey: 'login',
    permission: 'MANAGE_LOCALIZATION',
    icon: AppIcons.WRENCH_CLOCK,
    parent: 2,
  },
];
