import { AdminResult } from '@models/admin-result';
import { CallRequest } from '@models/call-request';
import { getDateString } from '@utils/utils';
import { ModelInterceptorContract } from 'cast-response';
import { format, getTime, parseISO, set } from 'date-fns';

export class CallRequestInterceptor
  implements ModelInterceptorContract<CallRequest>
{
  send(model: Partial<CallRequest>): Partial<CallRequest> {
    if (typeof model.summonTime === 'string') {
      const [myHours, minutesWithAMPM] = model.summonTime.split(':');
      const [minutes, AMPM] = minutesWithAMPM.split(' ');

      const hours =
        AMPM === 'PM' && Number(myHours) !== 12
          ? Number(myHours) + 12
          : AMPM === 'AM' && Number(myHours) === 12
            ? 0
            : Number(myHours);

      const summonDate = new Date(model.summonDate!);

      const combinedDateTime = set(summonDate, {
        hours: hours,
        minutes: Number(minutes),
        seconds: 0,
        milliseconds: 0,
      });

      model.summonDate = getDateString(summonDate);
      model.summonTime = getDateString(combinedDateTime);
    }
    delete model.apologyReasonInfo;
    delete model.createdByInfo;
    delete model.statusInfo;
    delete model.summonInfo;
    delete model.summonTypeInfo;
    delete model.typeInfo;
    return model;
  }

  receive(model: CallRequest): CallRequest {
    model.statusInfo = AdminResult.createInstance(model.statusInfo);
    model.createdByInfo = AdminResult.createInstance(model.createdByInfo);
    model.apologyReasonInfo = AdminResult.createInstance(
      model.apologyReasonInfo,
    );
    model.summonTypeInfo = AdminResult.createInstance(model.summonTypeInfo);
    model.typeInfo = AdminResult.createInstance(model.typeInfo);
    if (model.summonTime) {
      const time = getTime(parseISO(model.summonTime as string));
      model.summonTime = format(time, 'hh:mm a');
    }
    return model;
  }
}
