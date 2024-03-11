import { InterceptModel } from 'cast-response';
import { BaseModel } from '@abstracts/base-model';
import { MeetingInterceptor } from '@model-interceptors/meeting-interceptor';
import { MeetingService } from '@services/meeting.service';
import { MeetingAttendance } from '@models/meeting-attendance';
import { MeetingReport } from '@models/meeting-report';
import { CustomValidators } from '@validators/custom-validators';

const { send, receive } = new MeetingInterceptor();

@InterceptModel({ send, receive })
export class Meeting extends BaseModel<Meeting, MeetingService> {
  override $$__service_name__$$: string = 'MeetingService';

  caseId!: string;
  title!: string;
  note!: string;
  meetingDate!: Date | string;
  meetingTime!: string;
  createdBy!: number;
  createdOn!: Date | string;
  attendanceList: MeetingAttendance[] = [];
  reportList: MeetingReport[] = [];
  offenderList: number[] = [];

  buildForm(controls: boolean = false) {
    const { title, note, meetingDate, meetingTime } = this;
    return {
      title: controls ? [title, CustomValidators.required] : title,

      note: controls ? [note, CustomValidators.required] : note,
      meetingDate: controls
        ? [meetingDate, CustomValidators.required]
        : meetingDate,
      meetingTime: controls
        ? [meetingTime, CustomValidators.required]
        : meetingTime,
    };
  }
}
