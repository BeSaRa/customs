import { BaseModel } from '@abstracts/base-model';
import { InboxCounterInterceptor } from '@model-interceptors/inbox-counter-interceptor';
import { InboxCounterService } from '@services/inbox-counter.service';
import { InterceptModel } from 'cast-response';
import { AdminResult } from './admin-result';

const { send, receive } = new InboxCounterInterceptor();

@InterceptModel({ send, receive })
export class InboxCounter extends BaseModel<InboxCounter, InboxCounterService> {
  $$__service_name__$$ = 'InboxCounterService';

  inboxCount!: number;

  counterId!: number;
  teamId!: number;
  counterInfo!: AdminResult;
  teamInfo!: AdminResult;
}
