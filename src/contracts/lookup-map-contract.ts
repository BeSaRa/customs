import { Lookup } from '@models/lookup';

export interface LookupMapContract {
  adminAuditOperation: Lookup[];
  adminLookupType: Lookup[];
  allRequestTypes: Lookup[];
  commentType: Lookup[];
  commonCaseStatus: Lookup[];
  commonStatus: Lookup[];
  currency: Lookup[];
  errorCodes: Lookup[];
  gender: Lookup[];
  internalDepStatus: Lookup[];
  licenseStatus: Lookup[];
  localizationModule: Lookup[];
  loginStatus: Lookup[];
  menuItemParameters: Lookup[];
  menuType: Lookup[];
  menuView: Lookup[];
  nationality: Lookup[];
  organizationUniType: Lookup[];
  penaltyPowers: Lookup[];
  penaltyRepeat: Lookup[];
  penaltySigner: Lookup[];
  penaltyType: Lookup[];
  permissionCategory: Lookup[];
  riskStatus: Lookup[];
  serviceActionType: Lookup[];
  serviceRequestType: Lookup[];
  userType: Lookup[];
  permissionGroups: Lookup[];
  offenderLevel: Lookup[];
  penaltyGuidance: Lookup[];
  offenderType: Lookup[];
}
