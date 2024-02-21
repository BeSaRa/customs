import { Lookup } from '@models/lookup';

export interface LookupMapContract {
  suspensionTypes: Lookup[];
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
  organizationUnitType: Lookup[];
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
  managerDecisionControl: Lookup[];
  violationLevel: Lookup[];
  criminalType: Lookup[];
  violationClassification: Lookup[];
  responsibilityRepeatViolations: Lookup[];
  offenderTypeAll: Lookup[];
  securityManagement: Lookup[];
  personType: Lookup[];
  witnessType: Lookup[];
  securityLevel: Lookup[];
  proofStatus: Lookup[];
  CareerLevel: Lookup[];
}
