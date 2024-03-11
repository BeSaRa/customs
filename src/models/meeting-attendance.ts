import { InterceptModel } from 'cast-response';
import { MeetingAttendanceInterceptor } from '@model-interceptors/meeting-attendance-interceptor';
import { AdminResult } from '@models/admin-result';

const { send, receive } = new MeetingAttendanceInterceptor();

@InterceptModel({ send, receive })
export class MeetingAttendance {
  id!: number;
  updatedOn!: string | Date;
  attendeeId!: number;
  note!: string;
  status!: number;
  attendeeInfo!: AdminResult;
  statusInfo!: AdminResult;
}
