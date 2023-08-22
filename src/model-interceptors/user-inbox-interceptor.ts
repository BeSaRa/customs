import { ModelInterceptorContract } from 'cast-response';
import { UserInbox } from '@models/user-inbox';
import { AdminResult } from '@models/admin-result';

export class UserInboxInterceptor implements ModelInterceptorContract<UserInbox> {
  send(model: Partial<UserInbox>): Partial<UserInbox> {
    return model;
  }

  receive(model: UserInbox): UserInbox {
    model.PI_CREATE = new Date(model.PI_CREATE).toLocaleDateString();
    model.PI_DUE = new Date(model.PI_DUE).toLocaleDateString();
    model.ACTIVATED = new Date(model.ACTIVATED).toLocaleDateString();
    model.riskStatusInfo = new AdminResult().clone(model.riskStatusInfo);
    model.fromUserInfo = new AdminResult().clone(model.fromUserInfo);
    return model;
  }
}
