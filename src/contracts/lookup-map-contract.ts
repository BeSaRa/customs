import { Lookup } from '@models/lookup';

export interface LookupMapContract {
  offenderStatus: Lookup[];
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
  permissionGroup: Lookup[];
  offenderLevel: Lookup[];
  penaltyGuidance: Lookup[];
  offenderType: Lookup[];
  offenderTypeWithNone: Lookup[];
  managerDecisionControl: Lookup[];
  violationLevel: Lookup[];
  criminalType: Lookup[];
  violationClassification: Lookup[];
  offenderTypeAll: Lookup[];
  securityManagement: Lookup[];
  personType: Lookup[];
  witnessType: Lookup[];
  securityLevel: Lookup[];
  securityLevelsWithAll: Lookup[];
  proofStatus: Lookup[];
  careerLevel: Lookup[];
  apologyReason: Lookup[];
  administrativeInvestigationCategory: Lookup[];
  administrativeInvestigationReportStatus: Lookup[];
  summonType: Lookup[];
  obligationToAttendStatus: Lookup[];
  decisionReportStatus: Lookup[];
  meetingStatus: Lookup[];
  calendarFormat: Lookup[];
  customsViolationEffect: Lookup[];
  DelegationType: Lookup[];
  attendeeType: Lookup[];
  GrievanceFinalDecision: Lookup[];
  responsibilityRepeatViolations: Lookup[];
  caseGeneralStatus: Lookup[];
  penaltyStatus: Lookup[];
  DelegationStatus: Lookup[];
}
