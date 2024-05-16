import { LangKeysContract } from '@contracts/lang-keys-contract';
import { AppPermissionsType } from '@constants/app-permissions';
import { AppPermissionsGroupType } from '@constants/app-permissions-group';
import { TeamNames } from '@enums/team-names';
import { Common } from '@models/common';

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
  counter?: keyof Common['counters'];
  children?: MenuItemContract[];
  translate?: string;
  arabicSearchText?: string;
  englishSearchText?: string;
  searchText?: string;
  permissionFromTeam?: TeamNames;
}
