import { Audit } from '@models/audit';
import { ModelInterceptorContract } from 'cast-response';

export class AuditInterceptor implements ModelInterceptorContract<Audit> {
  send(model: Partial<Audit>): Partial<Audit> {
    return model;
  }

  receive(model: Audit): Audit {
    return model;
  }
}
