import { BaseCase } from '@models/base-case';
import { GrievanceService } from '@services/grievance.service';
import { AdminResult } from '@models/admin-result';
import { CustomValidators } from '@validators/custom-validators';

export class Grievance extends BaseCase<GrievanceService, Grievance> {
  override $$__service_name__$$: string = 'GrievanceService';

  lastModified!: Date | string;
  lastModifier!: string;
  draftSerial!: number;
  draftFullSerial!: string;
  investigationSerial!: number;
  investigationFullSerial!: string;
  departmentId!: number;
  presidentAssistantOuId!: number;
  isDrafted!: boolean;
  subject!: string;
  presidentAssistantOuInfo!: AdminResult;
  securityLevelInfo!: AdminResult;
  securityGroups: string[] = [];
  applicantType!: number;
  createdByDomainName!: string;
  offenderId!: number;
  offenderType!: number;
  penaltyId!: number;
  penaltySigner!: number;
  penaltySignerId!: number;
  officeRecommendation!: number;
  commentList: string[] = [];
  offenderInfo!: AdminResult;
  applicantTypeInfo!: AdminResult;
  offenderTypeInfo!: AdminResult;
  penaltyInfo!: AdminResult;
  penaltySignerRoleInfo!: AdminResult;
  penaltySignerInfo!: AdminResult;
  officeRecommendationInfo!: AdminResult;
  override buildForm() {
    return {
      description: ['', [CustomValidators.maxLength(3000)]],
    };
  }
}
