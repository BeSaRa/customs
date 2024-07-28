import { BaseCase } from '@models/base-case';
import { GrievanceService } from '@services/grievance.service';
import { AdminResult } from '@models/admin-result';
import { CustomValidators } from '@validators/custom-validators';
import { InterceptModel } from 'cast-response';
import { GrievanceInterceptor } from '@model-interceptors/grievance-interceptor';
import { GrievanceComment } from '@models/grievance-comment';

const { send, receive } = new GrievanceInterceptor();

@InterceptModel({ send, receive })
export class Grievance extends BaseCase<GrievanceService, Grievance> {
  override $$__service_name__$$: string = 'GrievanceService';

  lastModified!: Date | string;
  lastModifier!: string;
  draftSerial!: number;
  draftFullSerial!: string;
  investigationSerial!: number;
  investigationFullSerial!: string;
  grievanceSerial!: number;
  grievanceFullSerial!: string;
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
  recommendedPenaltyId!: number;
  penaltySigner!: number;
  penaltySignerId!: number;
  justification!: string;
  commentList: GrievanceComment[] = [];
  finalDecision!: number;
  offenderInfo!: AdminResult;
  applicantTypeInfo!: AdminResult;
  offenderTypeInfo!: AdminResult;
  penaltyInfo!: AdminResult;
  penaltySignerRoleInfo!: AdminResult;
  penaltySignerInfo!: AdminResult;
  finalDecisionInfo!: AdminResult;

  override buildForm() {
    return {
      description: ['', [CustomValidators.maxLength(3000)]],
      commentList: [''],
    };
  }

  buildCompleteForm() {
    const { penaltyId, finalDecision, justification, recommendedPenaltyId } =
      this;
    return {
      justification: [
        justification,
        [CustomValidators.required, CustomValidators.maxLength(10000)],
      ],
      finalDecision: [finalDecision, [CustomValidators.required]],
      penaltyId: [{ value: penaltyId, disabled: true }],
      recommendedPenaltyId: [
        {
          value: recommendedPenaltyId ? recommendedPenaltyId : penaltyId,
          disabled: true,
        },
      ],
    };
  }
}
