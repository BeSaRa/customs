import { StatusTypes } from '@enums/status-types';
import { MenuTypes } from '@enums/menu-types';
import { MenuView } from '@enums/menu-view';
import { UserTypes } from '@enums/user-types';

export interface CustomMenuSearchCriteria {
  'menu-order': number;
  'menu-type': MenuTypes;
  'menu-view': MenuView;
  'user-type': UserTypes;
  'parent-menu-item-id': number;

  status: StatusTypes;
  offset: number;
  limit: number;
}
