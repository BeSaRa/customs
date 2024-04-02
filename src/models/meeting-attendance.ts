import { InterceptModel } from 'cast-response';
import { MeetingAttendanceInterceptor } from '@model-interceptors/meeting-attendance-interceptor';
import { AdminResult } from '@models/admin-result';
import { Cloner } from '@abstracts/cloner';

const { send, receive } = new MeetingAttendanceInterceptor();

@InterceptModel({ send, receive })
export class MeetingAttendance extends Cloner {
  id!: number;
  updatedOn!: string | Date;
  attendeeId!: number;
  note!: string;
  status!: number;
  attendeeInfo!: AdminResult;
  statusInfo!: AdminResult;
}
