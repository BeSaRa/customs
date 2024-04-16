import { LangKeysContract } from '@contracts/lang-keys-contract';
import { AppPermissionsType } from '@constants/app-permissions';
import { AppPermissionsGroupType } from '@constants/app-permissions-group';
import { LDAPGroupNames } from '@enums/department-group-names.enum';

export interface MenuItemContract {
  id: number;
  langKey: keyof LangKeysContract;
  icon?: string;
  path?: string;
  permission?: keyof AppPermissionsType;
  permissionGroup?: keyof AppPermissionsGroupType;
  parent?: number;
  arName?: string;
  enName?: string;
  order?: number;
  children?: MenuItemContract[];
  translate?: string;
  arabicSearchText?: string;
  englishSearchText?: string;
  searchText?: string;
  permissionFromTeam?: LDAPGroupNames;
}
