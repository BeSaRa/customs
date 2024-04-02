import { ModelInterceptorContract } from 'cast-response';
import { AdminResult } from '@models/admin-result';
import { MeetingMinutes } from '@models/meeting-minutes';

export class MeetingMinutesInterceptor
  implements ModelInterceptorContract<MeetingMinutes>
{
  send(model: Partial<MeetingMinutes>): Partial<MeetingMinutes> {
    delete model.meetingInfo;
    delete model.attachmentTypeInfo;
    delete model.creatorInfo;
    delete model.ouInfo;
    delete model.generalStatusInfo;
    return model;
  }

  receive(model: MeetingMinutes): MeetingMinutes {
    model.meetingInfo &&
      (model.meetingInfo = AdminResult.createInstance(model.meetingInfo));
    model.creatorInfo &&
      (model.creatorInfo = AdminResult.createInstance(model.creatorInfo));
    model.ouInfo && (model.ouInfo = AdminResult.createInstance(model.ouInfo));
    model.generalStatusInfo &&
      (model.generalStatusInfo = AdminResult.createInstance(
        model.generalStatusInfo,
      ));

    return model;
  }
}
