import { ClearingAgent } from '@models/clearing-agent';

export class ClearingAgentCriteria extends ClearingAgent {
  override buildForm(controls = false): object {
    const { arName, enName, qid, agencyId, agentCustomCode, agentctLicenseNo, agencyArabicCompanyName, agencyLicenseNo } = this;
    return {
      arName: controls ? [arName] : arName,
      enName: controls ? [enName] : enName,
      qid: controls ? [qid] : qid,
      // agencyId: controls ? [agencyId] : agencyId,
      code: controls ? [agentCustomCode] : agentCustomCode,
      // licenseNumber: controls ? [agentctLicenseNo] : agentctLicenseNo,
      agencyArabicCompanyName: controls ? [agencyArabicCompanyName] : agencyArabicCompanyName,
      agencyLicenseNo: controls ? [agencyLicenseNo] : agencyLicenseNo,
    };
  }
}
