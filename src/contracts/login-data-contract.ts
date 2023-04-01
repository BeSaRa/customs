import { InternalUser } from '@models/internal-user';
import { LookupMapContract } from '@contracts/lookup-map-contract';
import { Permission } from '@models/permission';

export interface LoginDataContract {
  internalUser: InternalUser;
  lookupMap: LookupMapContract;
  menuItems: unknown[];
  organizationUnit: object;
  organizationUnits: unknown[];
  permissionSet: Permission[];
  teams: unknown[];
  token: string;
  type: number;
  userSecConfig: object;
}
