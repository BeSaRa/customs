import { ModelInterceptorContract } from 'cast-response';
import { MeetingAttendance } from '@models/meeting-attendance';
import { AdminResult } from '@models/admin-result';

export class MeetingAttendanceInterceptor
  implements ModelInterceptorContract<MeetingAttendance>
{
  send(model: Partial<MeetingAttendance>): Partial<MeetingAttendance> {
    delete model.attendeeInfo;
    delete model.statusInfo;

    return model;
  }

  receive(model: MeetingAttendance): MeetingAttendance {
    model.attendeeInfo &&
      (model.attendeeInfo = AdminResult.createInstance(model.attendeeInfo));
    model.statusInfo &&
      (model.statusInfo = AdminResult.createInstance(model.statusInfo));
    return model;
  }
}
