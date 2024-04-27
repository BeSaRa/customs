import { ModelInterceptorContract } from 'cast-response';
import { CallRequest } from '@models/call-request';
import { format, getTime, parseISO, set } from 'date-fns';
import { AdminResult } from '@models/admin-result';

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
    model.statusInfo = AdminResult.createInstance(model.statusInfo);
    model.createdByInfo = AdminResult.createInstance(model.createdByInfo);
    try {
      const time = getTime(parseISO(model.summonTime as string));
      model.summonTime = format(time, 'hh:mm a');
    } catch (e) {
      console.log('failed to parse call request', e);
    }
    return model;
  }
}
