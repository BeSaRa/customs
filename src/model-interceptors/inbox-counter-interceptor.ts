import { AdminResult } from '@models/admin-result';
import { InboxCounter } from '@models/inbox-counter';
import { ModelInterceptorContract } from 'cast-response';

export class InboxCounterInterceptor
  implements ModelInterceptorContract<InboxCounter>
{
  send(model: Partial<InboxCounter>): Partial<InboxCounter> {
    return model;
  }

  receive(model: InboxCounter): InboxCounter {
    model.teamInfo = new AdminResult().clone(model.teamInfo);
    model.counterInfo = new AdminResult().clone(model.counterInfo);
    return model;
  }
}
