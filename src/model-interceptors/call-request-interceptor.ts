import { AdminResult } from '@models/admin-result';
import { CallRequest } from '@models/call-request';
import { ModelInterceptorContract } from 'cast-response';
import { format, getTime, parseISO } from 'date-fns';

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

      const _date = new Date(
        format(new Date(model.summonDate!), 'yyyy-MM-dd', {
          locale: undefined,
        }),
      );
      model.summonDate = new Date(_date);
      _date.setUTCHours(hours);
      _date.setUTCMinutes(Number(minutes));
      model.summonTime = _date;
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
