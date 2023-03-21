import { Lookup } from '@models/lookup';

export interface LookupMapContract {
  AdminAuditOperation: Lookup[];
  AdminLookupType: Lookup[];
  AllRequestTypes: Lookup[];
  CommentType: Lookup[];
  CommonCaseStatus: Lookup[];
  CommonStatus: Lookup[];
  Currency: Lookup[];
  ErrorCodes: Lookup[];
  Gender: Lookup[];
  InternalDepStatus: Lookup[];
  LicenseStatus: Lookup[];
  LocalizationModule: Lookup[];
  LoginStatus: Lookup[];
  MenuItemParameters: Lookup[];
  MenuType: Lookup[];
  MenuView: Lookup[];
  Nationality: Lookup[];
  OrganizationUniType: Lookup[];
  PenaltyPowers: Lookup[];
  PenaltyRepeat: Lookup[];
  PenaltyType: Lookup[];
  PermissionCategory: Lookup[];
  RiskStatus: Lookup[];
  ServiceActionType: Lookup[];
  ServiceRequestType: Lookup[];
  UserType: Lookup[];
}
