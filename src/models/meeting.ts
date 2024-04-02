import { InterceptModel } from 'cast-response';
import { BaseModel } from '@abstracts/base-model';
import { MeetingInterceptor } from '@model-interceptors/meeting-interceptor';
import { MeetingService } from '@services/meeting.service';
import { MeetingAttendance } from '@models/meeting-attendance';
import { MeetingReport } from '@models/meeting-report';
import { CustomValidators } from '@validators/custom-validators';
import { MeetingStatusEnum } from '@enums/meeting-status-enum';
import { AdminResult } from '@models/admin-result';

const { send, receive } = new MeetingInterceptor();

@InterceptModel({ send, receive })
export class Meeting extends BaseModel<Meeting, MeetingService> {
  override $$__service_name__$$: string = 'MeetingService';

  caseId!: string;
  title!: string;
  note!: string;
  meetingMinutesText!: string;
  meetingDate!: Date | string;
  createdBy!: number;
  createdByInfo!: AdminResult;
  createdOn!: Date | string;
  attendanceList: MeetingAttendance[] = [];
  reportList: MeetingReport[] = [];
  offenderList: number[] = [];
  place!: string;
  meetingTimeFrom!: string | number;
  meetingTimeTo!: string | number;
  override status: number = MeetingStatusEnum.held;
  buildForm(controls: boolean = false, disabled: boolean = false) {
    const {
      title,
      note,
      meetingDate,
      place,
      meetingTimeFrom,
      meetingTimeTo,
      meetingMinutesText,
      status,
    } = this;
    return {
      title: controls
        ? [{ value: title, disabled }, CustomValidators.required]
        : title,
      note: controls ? [{ value: note, disabled }] : note,
      meetingDate: controls
        ? [meetingDate, CustomValidators.required]
        : meetingDate,
      place: controls
        ? [{ value: place, disabled }, CustomValidators.required]
        : place,
      meetingTimeFrom: controls
        ? [meetingTimeFrom, CustomValidators.required]
        : meetingTimeFrom,
      status: controls ? [{ value: status, disabled }] : status,
      meetingTimeTo: controls
        ? [meetingTimeTo, CustomValidators.required]
        : meetingTimeTo,
      meetingMinutesText: controls ? [meetingMinutesText] : meetingMinutesText,
    };
  }
}
