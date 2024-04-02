import { CaseAttachment } from '@models/case-attachment';
import { AdminResult } from '@models/admin-result';
import { InterceptModel } from 'cast-response';
import { MeetingMinutesInterceptor } from '@model-interceptors/meeting-minutes-interceptor';

const { send, receive } = new MeetingMinutesInterceptor();
@InterceptModel({ send, receive })
export class MeetingMinutes extends CaseAttachment {
  concernedId!: number;
  offenderIds: number[] = [];
  meetingInfo!: AdminResult;
  generalStatus!: number;
  generalStatusInfo!: AdminResult;
}
