import { ModelInterceptorContract } from 'cast-response';
import { InvestigationForExternalUser } from '@models/investigation-for-external-user';
import { AdminResult } from '@models/admin-result';

export class InvestigationForExternalUserInterceptor
  implements ModelInterceptorContract<InvestigationForExternalUser>
{
  send(
    model: Partial<InvestigationForExternalUser>,
  ): Partial<InvestigationForExternalUser> {
    return model;
  }

  receive(model: InvestigationForExternalUser): InvestigationForExternalUser {
    model.caseStatusInfo = new AdminResult().clone(model.caseStatusInfo);

    return model;
  }
}
