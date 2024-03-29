import { InternalUser } from '@models/internal-user';
import { LookupMapContract } from '@contracts/lookup-map-contract';
import { Permission } from '@models/permission';
import { OrganizationUnit } from '@models/organization-unit';
import { Team } from '@models/team';
import { MawaredEmployee } from '@models/mawared-employee';
import { ClearingAgent } from '@models/clearing-agent';
import { ClearingAgency } from '@models/clearing-agency';

export interface LoginDataContract {
  internalUser: InternalUser;
  lookupMap: LookupMapContract;
  menuItems: unknown[];
  organizationUnit: OrganizationUnit;
  organizationUnits: OrganizationUnit[];
  permissionSet: Permission[];
  person: MawaredEmployee | ClearingAgent;
  clearingAgency: ClearingAgency;
  teams: Team[];
  token: string;
  type: number;
  userSecConfig: object;
}
