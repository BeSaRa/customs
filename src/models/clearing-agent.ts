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
  agentName!: string;
  agentQatarId!: string;
  agentTelNo!: string;
  agentEmail!: string;

  buildForm(controls = false): object {
    const {
      enName,
      arName,
      agentctLicenseNo,
      status,
      agentLicenseIssueDate,
      agentCustomCode,
      agentLicenseExpiryDate,
      agentTelNo,
      agentEmail,
      agentQatarId,
      agencyId,
    } = this;
    return {
      enName: controls ? [enName, CustomValidators.required] : enName,
      arName: controls ? [arName, CustomValidators.required] : arName,
      agentctLicenseNo: controls ? [agentctLicenseNo, CustomValidators.required] : agentctLicenseNo,
      agentLicenseIssueDate: controls ? [agentLicenseIssueDate, CustomValidators.required] : agentLicenseIssueDate,
      AgentLicenseExpiryDate: controls ? [agentLicenseExpiryDate, CustomValidators.required] : agentLicenseExpiryDate,
      agentCustomCode: controls ? [agentCustomCode, CustomValidators.required] : agentCustomCode,
      agentTelNo: controls ? [agentTelNo, CustomValidators.required] : agentTelNo,
      agentEmail: controls ? [agentEmail, CustomValidators.required] : agentEmail,
      agentQatarId: controls ? [agentQatarId, CustomValidators.required] : agentQatarId,
      agencyId: controls ? [agencyId, CustomValidators.required] : agencyId,
      status: controls ? [status] : status,
    };
  }

  getStatusInfoName() {
    return this.statusInfo.getNames();
  }

  convertToOffender(caseId: string) {
    return new Offender().clone<Offender>({
      type: OffenderTypes.BROKER,
      caseId: caseId,
      arName: this.arName,
      enName: this.enName,
      status: 1,
      offenderRefId: this.agentId,
      ouId: this.agencyId,
    });
  }
  convertToWitness(caseId: string, personType: number): Witness {
    return new Witness().clone<Witness>({
      personType,
      caseId: caseId,
      enName: this.arName,
      arName: this.arName,
      witnessType: WitnessTypes.BROKER,
      witnessRefId: this.agentId,
      status: 1,
    });
  }
}
