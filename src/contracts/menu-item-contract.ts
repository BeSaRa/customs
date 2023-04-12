import { LangKeysContract } from '@contracts/lang-keys-contract';
import { AppPermissionsType } from '@constants/app-permissions';
import { AppIcons } from '@enums/app-icons';

export interface MenuItemContract {
  id: number;
  langKey: keyof LangKeysContract;
  icon?: AppIcons;
  path?: string;
  permission?: keyof AppPermissionsType;
  permissionGroup?: string;
  parent?: number;
  arName?: string;
  enName?: string;
  order?: number;
  children?: MenuItemContract[];
  translate?: string;
  arabicSearchText?: string;
  englishSearchText?: string;
  searchText?: string;
}
