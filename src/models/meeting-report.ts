import { InterceptModel } from 'cast-response';
import { MeetingAttendanceInterceptor } from '@model-interceptors/meeting-attendance-interceptor';

const { send, receive } = new MeetingAttendanceInterceptor();

@InterceptModel({ send, receive })
export class MeetingReport {
  id!: number;
  updatedOn!: string | Date;

  offenderId!: number;
  penaltyId!: number;
  // need to have info
  note!: string;
}
