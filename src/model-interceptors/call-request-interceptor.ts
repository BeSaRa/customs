import { ModelInterceptorContract } from 'cast-response';
import { CallRequest } from '@models/call-request';

export class CallRequestInterceptor
  implements ModelInterceptorContract<CallRequest>
{
  send(model: Partial<CallRequest>): Partial<CallRequest> {
    return model;
  }

  receive(model: CallRequest): CallRequest {
    return model;
  }
}
