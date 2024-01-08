import { ModelInterceptorContract } from 'cast-response';
import { ClearingAgency } from '@models/clearing-agency';
import { AdminResult } from '@models/admin-result';

export class ClearingAgencyInterceptor implements ModelInterceptorContract<ClearingAgency> {
  send(model: Partial<ClearingAgency>): Partial<ClearingAgency> {
    return model;
  }

  receive(model: ClearingAgency): ClearingAgency {
    model.enName = model.englishCompanyName;
    model.arName = model.arabicCompanyName;
    model.licenseIssueDate = model.licenseIssueDate.split('.')[0] ?? model.licenseIssueDate;
    model.licenseExpiryDate = model.licenseExpiryDate.split('.')[0] ?? model.licenseExpiryDate;
    model.statusInfo && (model.statusInfo = AdminResult.createInstance(model.statusInfo));
    return model;
  }
}
