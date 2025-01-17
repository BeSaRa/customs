import { BaseModel } from '@abstracts/base-model';
import { ClearingAgentService } from '@services/clearing-agent.service';
import { ClearingAgentInterceptor } from '@model-interceptors/clearing-agent-interceptor';
import { InterceptModel } from 'cast-response';
import { AdminResult } from './admin-result';
import { Offender } from './offender';
import { OffenderTypes } from '@enums/offender-types';
import { Witness } from './witness';
import { WitnessTypes } from '@enums/witness-types';
import { NamesContract } from '@contracts/names-contract';
import { CustomsViolationEffect } from '@enums/customs-violation-effect';

const { send, receive } = new ClearingAgentInterceptor();

@InterceptModel({ send, receive })
export class ClearingAgent extends BaseModel<
  ClearingAgent,
  ClearingAgentService
> {
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
  code?: string;
  agencyStatus!: number;
  agencyApprovalStatus!: number;

  // not related to the model
  jobTitleCode!: string;

  buildForm(): object {
    const {
      enName,
      arName,
      phoneNumber,
      agentctLicenseNo,
      agentCustomCode,
      agentLicenseIssueDate,
      agentLicenseExpiryDate,
      agencyId,
      status,
      email,
      qid,
      agentPreviousLicenseFeePenalty,
      agencyApprovalStatus,
      agencyStatus,
    } = this;
    return {
      enName,
      arName,
      agentctLicenseNo,
      agentLicenseIssueDate,
      agentLicenseExpiryDate,
      agentCustomCode,
      phoneNumber,
      email,
      qid,
      agencyId,
      agentPreviousLicenseFeePenalty,
      status,
      agencyStatus,
      agencyApprovalStatus,
    };
  }

  getStatusInfoName() {
    return this.statusInfo?.getNames() || '';
  }

  convertToOffender(caseId: string) {
    return new Offender().clone<Offender>({
      type: OffenderTypes.BROKER,
      caseId: caseId,
      arName: this.arName,
      enName: this.enName,
      status: 1,
      offenderRefId: this.id,
      ouId: this.agencyId,
      customsViolationEffect: CustomsViolationEffect.BROKER,
    });
  }

  convertToWitness(caseId: string, personType: number): Witness {
    return new Witness().clone<Witness>({
      personType,
      caseId: caseId,
      enName: this.enName,
      arName: this.arName,
      witnessType: WitnessTypes.CLEARING_AGENT,
      witnessRefId: this.id,
      status: 1,
    });
  }

  isEmployee(): boolean {
    return false;
  }

  isAgent(): boolean {
    return true;
  }

  override getNames(): string {
    return (
      this[
        (this.getLangService().getCurrent().code +
          'Name') as keyof NamesContract
      ] ||
      this[
        (this.getLangService().getCurrent().toggleTo +
          'Name') as keyof NamesContract
      ]
    );
  }

  getCompanyName(): string {
    const current = this.getLangService().getCurrent();
    const property =
      current.code === 'ar'
        ? 'agencyArabicCompanyName'
        : 'agencyEnglishCompanyName';
    return this[property];
  }
}
