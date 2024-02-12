import { ModelInterceptorContract } from 'cast-response';
import { ClearingAgent } from '@models/clearing-agent';
import { AdminResult } from '@models/admin-result';

export class ClearingAgentInterceptor
  implements ModelInterceptorContract<ClearingAgent>
{
  send(model: Partial<ClearingAgent>): Partial<ClearingAgent> {
    delete model.statusInfo;
    delete model.typeInfo;
    delete model.agencyInfo;
    return model;
  }

  receive(model: ClearingAgent): ClearingAgent {
    model.agentLicenseIssueDate =
      model.agentLicenseIssueDate.split('.')[0] ?? model.agentLicenseIssueDate;
    model.agentLicenseExpiryDate =
      model.agentLicenseExpiryDate.split('.')[0] ??
      model.agentLicenseExpiryDate;
    model.statusInfo &&
      (model.statusInfo = AdminResult.createInstance(model.statusInfo));
    model.typeInfo &&
      (model.typeInfo = AdminResult.createInstance(model.typeInfo));
    model.agencyInfo = AdminResult.createInstance({
      enName: model.agencyEnglishCompanyName,
      arName: model.agencyArabicCompanyName,
      id: model.agencyId,
    });
    return model;
  }
}
