import { ModelInterceptorContract } from 'cast-response';
import { InboxResult } from '@models/inbox-result';
import { AdminResult } from '@models/admin-result';

export class InboxInterceptor implements ModelInterceptorContract<InboxResult> {
  send(model: Partial<InboxResult>): Partial<InboxResult> {
    delete model.service;
    delete model.encrypt;
    return model;
  }

  receive(model: InboxResult): InboxResult {
    model.riskStatusInfo = new AdminResult().clone(model.riskStatusInfo);
    model.fromUserInfo = new AdminResult().clone(model.fromUserInfo);
    try {
      model.setItemRoute();
    } catch (e) {
      //
    }
    return model;
  }
}
