import { ModelInterceptorContract } from 'cast-response';
import { InboxResult } from '@models/inbox-result';
import { AdminResult } from '@models/admin-result';

export class InboxInterceptor implements ModelInterceptorContract<InboxResult> {
  send(model: Partial<InboxResult>): Partial<InboxResult> {
    return model;
  }

  receive(model: InboxResult): InboxResult {
    model.PI_CREATE = new Date(model.PI_CREATE).toLocaleDateString();
    model.PI_DUE = new Date(model.PI_DUE).toLocaleDateString();
    model.ACTIVATED = new Date(model.ACTIVATED).toLocaleDateString();
    model.riskStatusInfo = new AdminResult().clone(model.riskStatusInfo);
    model.fromUserInfo = new AdminResult().clone(model.fromUserInfo);
    try {
      model.setItemRoute();
    } catch (e) {}
    return model;
  }
}
