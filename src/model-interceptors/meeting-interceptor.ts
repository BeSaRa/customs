import { ModelInterceptorContract } from 'cast-response';
import { Meeting } from '@models/meeting';
import { AdminResult } from '@models/admin-result';
import { MeetingAttendanceInterceptor } from '@model-interceptors/meeting-attendance-interceptor';
import { MeetingAttendance } from '@models/meeting-attendance';
import { getDateString } from '@utils/utils';
import { format } from 'date-fns';

const meetingAttendanceInterceptor = new MeetingAttendanceInterceptor();
export class MeetingInterceptor implements ModelInterceptorContract<Meeting> {
  send(model: Partial<Meeting>): Partial<Meeting> {
    delete model.statusInfo;
    delete model.createdByInfo;
    const date = new Date(
      new Date(
        format(new Date(model.meetingDate!), 'yyyy-MM-dd', {
          locale: undefined,
        }),
      ),
    );
    date.setHours(0);
    date.setMinutes(0);
    model.meetingDate = getDateString(date);
    if (model.meetingTimeFrom) {
      if (
        (model.meetingTimeFrom as string).split(' ')[1].toLowerCase() === 'pm'
      ) {
        date.setHours(+(model.meetingTimeFrom as string).split(':')[0] + 12);
      } else {
        date.setHours(+(model.meetingTimeFrom as string).split(':')[0]);
      }
      date.setMinutes(
        +(model.meetingTimeFrom as string).split(':')[1].split(' ')[0],
      );
      model.meetingTimeFrom = getDateString(date);
    }
    if (model.meetingTimeTo) {
      if (
        (model.meetingTimeTo as string).split(' ')[1].toLowerCase() === 'pm'
      ) {
        date.setHours(+(model.meetingTimeTo as string).split(':')[0] + 12);
      } else {
        date.setHours(+(model.meetingTimeTo as string).split(':')[0]);
      }
      date.setMinutes(
        +(model.meetingTimeTo as string).split(':')[1].split(' ')[0],
      );
      model.meetingTimeTo = getDateString(date);
    }
    model.attendanceList = model.attendanceList?.map(attendance => {
      return new MeetingAttendance().clone(
        meetingAttendanceInterceptor.send(attendance),
      );
    });
    return model;
  }

  receive(model: Meeting): Meeting {
    model.statusInfo &&
      (model.statusInfo = AdminResult.createInstance(model.statusInfo));
    model.createdByInfo &&
      (model.createdByInfo = AdminResult.createInstance(model.createdByInfo));
    let fromSuffix = 'am';
    let toSuffix = 'am';

    if (new Date(model.meetingTimeFrom).getHours() > 12) {
      model.meetingTimeFrom = new Date(model.meetingTimeFrom).setHours(
        new Date(model.meetingTimeFrom).getHours() - 12,
      );
      fromSuffix = 'pm';
    }
    model.meetingTimeFrom =
      new Date(model.meetingTimeFrom).getHours() +
      ':' +
      new Date(model.meetingTimeFrom).getMinutes() +
      ' ' +
      fromSuffix;

    if (new Date(model.meetingTimeTo).getHours() > 12) {
      model.meetingTimeTo = new Date(model.meetingTimeTo).setHours(
        new Date(model.meetingTimeTo).getHours() - 12,
      );
      toSuffix = 'pm';
    }
    model.meetingTimeTo =
      new Date(model.meetingTimeTo).getHours() +
      ':' +
      new Date(model.meetingTimeTo).getMinutes() +
      ' ' +
      toSuffix;

    model.attendanceList = model.attendanceList.map(attendance => {
      return new MeetingAttendance().clone<MeetingAttendance>(
        meetingAttendanceInterceptor.receive(attendance),
      );
    });
    return model;
  }
}
