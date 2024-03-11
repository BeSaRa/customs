import { InterceptModel } from 'cast-response';
import { BaseModel } from '@abstracts/base-model';
import { MeetingInterceptor } from '@model-interceptors/meeting-interceptor';
import { MeetingService } from '@services/meeting.service';
import { MeetingAttendance } from '@models/meeting-attendance';
import { MeetingReport } from '@models/meeting-report';

const { send, receive } = new MeetingInterceptor();

@InterceptModel({ send, receive })
export class Meeting extends BaseModel<Meeting, MeetingService> {
  override $$__service_name__$$: string = 'MeetingService';

  caseId!: string;
  title!: string;
  note!: string;
  meetingDate!: Date | string;
  createdBy!: number;
  createdOn!: Date | string;
  attendanceList: MeetingAttendance[] = [];
  reportList: MeetingReport[] = [];
  offenderList: number[] = [];
}
