import { ModelInterceptorContract } from 'cast-response';
import { ClearingAgent } from '@models/clearing-agent';
import { AdminResult } from '@models/admin-result';

export class ClearingAgentInterceptor implements ModelInterceptorContract<ClearingAgent> {
  send(model: Partial<ClearingAgent>): Partial<ClearingAgent> {
    return model;
  }

  receive(model: ClearingAgent): ClearingAgent {
    model.arName = model.agentName;
    model.agentLicenseIssueDate = model.agentLicenseIssueDate.split('.')[0] ?? model.agentLicenseIssueDate;
    model.agentLicenseExpiryDate = model.agentLicenseExpiryDate.split('.')[0] ?? model.agentLicenseExpiryDate;
    model.statusInfo && (model.statusInfo = AdminResult.createInstance(model.statusInfo));
    model.agencyInfo = AdminResult.createInstance({
      enName: model.agencyEnglishCompanyName,
      arName: model.agencyArabicCompanyName,
      id: model.agencyId,
    });
    return model;
  }
}