import { ModelInterceptorContract } from 'cast-response';
import { Memorandum } from '@models/memorandum';
import { AdminResult } from '@models/admin-result';

export class MemorandumInterceptor
  implements ModelInterceptorContract<Memorandum>
{
  send(model: Partial<Memorandum>): Partial<Memorandum> {
    return model;
  }
  receive(model: Memorandum): Memorandum {
    model.creatorInfo = AdminResult.createInstance(model.creatorInfo);
    model.ouInfo = AdminResult.createInstance(model.ouInfo);
    return model;
  }
}
