import { InternalUser } from '@models/internal-user';
import { LookupMapContract } from '@contracts/lookup-map-contract';

export interface LoginDataContract {
  internalUser: InternalUser;
  lookupMap: LookupMapContract;
  menuItems: unknown[];
  organizationUnit: object;
  organizationUnits: unknown[];
  permissionSet: unknown[];
  teams: unknown[];
  token: string;
  type: number;
  userSecConfig: object;
}
