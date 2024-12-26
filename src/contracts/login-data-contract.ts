import { InternalUser } from '@models/internal-user';
import { LookupMapContract } from '@contracts/lookup-map-contract';
import { Permission } from '@models/permission';
import { OrganizationUnit } from '@models/organization-unit';
import { Team } from '@models/team';
import { MawaredEmployee } from '@models/mawared-employee';
import { ClearingAgent } from '@models/clearing-agent';
import { ClearingAgency } from '@models/clearing-agency';
import { CustomMenu } from '@models/custom-menu';

export interface LoginDataContract {
  internalUser: InternalUser;
  lookupMap: LookupMapContract;
  menuItems: CustomMenu[];
  organizationUnit: OrganizationUnit;
  organizationUnits: OrganizationUnit[];
  permissionSet: Permission[];
  person: MawaredEmployee | ClearingAgent;
  clearingAgency: ClearingAgency;
  teams: Team[];
  accessToken: string;
  refreshToken: string;
  accessTimeOut: number;
  type: number;
  simpleSearch: boolean;
  userSecConfig: object;
}
