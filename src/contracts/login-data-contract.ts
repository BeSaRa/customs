import { InternalUser } from '@models/internal-user';
import { LookupMapContract } from '@contracts/lookup-map-contract';
import { Permission } from '@models/permission';
import { OrganizationUnit } from '@models/organization-unit';
import { Team } from '@models/team';

export interface LoginDataContract {
  internalUser: InternalUser;
  lookupMap: LookupMapContract;
  menuItems: unknown[];
  organizationUnit: OrganizationUnit;
  organizationUnits: unknown[];
  permissionSet: Permission[];
  teams: Team[];
  token: string;
  type: number;
  userSecConfig: object;
}
