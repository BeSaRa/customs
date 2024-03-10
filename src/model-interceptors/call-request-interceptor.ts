import { ModelInterceptorContract } from 'cast-response';
import { CallRequest } from '@models/call-request';
import { getTime, set } from 'date-fns';

export class CallRequestInterceptor
  implements ModelInterceptorContract<CallRequest>
{
  send(model: Partial<CallRequest>): Partial<CallRequest> {
    if (typeof model.summonTime === 'string') {
      const [myHours, minutesWithAMPM] = model.summonTime.split(':');
      const [minutes, AMPM] = minutesWithAMPM.split(' ');

      const hours =
        AMPM === 'PM'
          ? Number(myHours) + 12
          : Number(myHours) >= 12
            ? Number(myHours) - 12
            : Number(myHours);

      model.summonTime = getTime(
        set(model.summonDate! as Date, { hours, minutes: Number(minutes) }),
      );
    }
    return model;
  }

  receive(model: CallRequest): CallRequest {
    return model;
  }
}
