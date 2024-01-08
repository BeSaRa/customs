import { AdminResult } from './admin-result';

export class ClearingAgentMediator {
  agentId!: number;
  agencyId!: number;
  agencyArabicCompanyName!: string;
  agencyEnglishCompanyName!: string;
  agencyLicenseNo!: string;
  agentctLicenseNo!: string;
  agentCustomCode!: string;
  agentQatarId!: string; // TODO delete
  qid!: string;
  agentName!: string; //TODO delete
  arName!: string;
  enName!: string;
  agentTelNo!: string; //TODO delete
  phoneNumber!: string;
  agentEmail!: string; //TODO delete
  email!: string;
  address!: string;
  AgentLicenseIssueDate!: string;
  AgentLicenseExpiryDate!: string;
  AgentPreviousLicenseFeePenalty!: number;
  statusInfo!: AdminResult;
  statusDateModified!: string;
}
