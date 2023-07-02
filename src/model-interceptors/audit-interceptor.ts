import { Audit } from '@models/audit';
import { ModelInterceptorContract } from 'cast-response';
import { AdminResult } from '@models/admin-result';

export class AuditInterceptor implements ModelInterceptorContract<Audit> {
  send(model: Partial<Audit>): Partial<Audit> {
    return model;
  }

  receive(model: Audit): Audit {
    model.operationInfo = AdminResult.createInstance(model.operationInfo);
    model.userInfo = AdminResult.createInstance(model.userInfo);

    return model;
  }
}
