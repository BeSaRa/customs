import { InternalUser } from '@models/internal-user';
import { LookupMapContract } from '@contracts/lookup-map-contract';
import { Permission } from '@models/permission';
import { OrganizationUnit } from '@models/organization-unit';

export interface LoginDataContract {
  internalUser: InternalUser;
  lookupMap: LookupMapContract;
  menuItems: unknown[];
  organizationUnit: OrganizationUnit;
  organizationUnits: unknown[];
  permissionSet: Permission[];
  teams: unknown[];
  token: string;
  type: number;
  userSecConfig: object;
}
