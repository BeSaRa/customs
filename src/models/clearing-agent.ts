import { BaseModel } from '@abstracts/base-model';
import { ClearingAgentService } from '@services/clearing-agent.service';
import { ClearingAgentInterceptor } from '@model-interceptors/clearing-agent-interceptor';
import { InterceptModel } from 'cast-response';
import { CustomValidators } from '@validators/custom-validators';
import { AdminResult } from './admin-result';
import { Offender } from './offender';
import { OffenderTypes } from '@enums/offender-types';
import { Witness } from './witness';
import { WitnessTypes } from '@enums/witness-types';

const { send, receive } = new ClearingAgentInterceptor();

@InterceptModel({ send, receive })
export class ClearingAgent extends BaseModel<ClearingAgent, ClearingAgentService> {
  $$__service_name__$$ = 'ClearingAgentService';

  type!: number;
  address!: string;
  typeInfo!: AdminResult;
  agentId!: number;
  agencyId!: number;
  agencyArabicCompanyName!: string;
  agencyEnglishCompanyName!: string;
  agencyLicenseNo!: string;
  agentctLicenseNo!: string;
  agentCustomCode!: string;
  agentLicenseIssueDate!: string;
  agentLicenseExpiryDate!: string;
  agentPreviousLicenseFeePenalty!: number;
  agencyInfo!: AdminResult;
  qid!: string;
  phoneNumber!: string;
  email!: string;

  buildForm(controls = false): object {
    const {
      enName,
      arName,
      agentctLicenseNo,
      status,
      agentLicenseIssueDate,
      agentCustomCode,
      agentLicenseExpiryDate,
      phoneNumber,
      email,
      qid,
      agencyId,
    } = this;
    return {
      enName: controls ? [enName, CustomValidators.required] : enName,
      arName: controls ? [arName, CustomValidators.required] : arName,
      agentctLicenseNo: controls ? [agentctLicenseNo, CustomValidators.required] : agentctLicenseNo,
      agentLicenseIssueDate: controls ? [agentLicenseIssueDate, CustomValidators.required] : agentLicenseIssueDate,
      agentLicenseExpiryDate: controls ? [agentLicenseExpiryDate, CustomValidators.required] : agentLicenseExpiryDate,
      agentCustomCode: controls ? [agentCustomCode, CustomValidators.required] : agentCustomCode,
      phoneNumber: controls ? [phoneNumber, CustomValidators.required] : phoneNumber,
      email: controls ? [email, CustomValidators.required] : email,
      qid: controls ? [qid, CustomValidators.required] : qid,
      agencyId: controls ? [agencyId, CustomValidators.required] : agencyId,
      status: controls ? [status] : status,
    };
  }

  getStatusInfoName() {
    return this.statusInfo.getNames();
  }

  convertToOffender(caseId: string) {
    return new Offender().clone<Offender>({
      type: OffenderTypes.ClEARING_AGENT,
      caseId: caseId,
      arName: this.arName,
      enName: this.enName,
      status: 1,
      offenderRefId: this.id,
      ouId: this.agencyId,
    });
  }
  convertToWitness(caseId: string, personType: number): Witness {
    return new Witness().clone<Witness>({
      personType,
      caseId: caseId,
      enName: this.arName,
      arName: this.arName,
      witnessType: WitnessTypes.ClEARING_AGENT,
      witnessRefId: this.agentId,
      status: 1,
    });
  }
}
