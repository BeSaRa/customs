import { BaseModel } from '@abstracts/base-model';
import { InterceptModel } from 'cast-response';
import { CallRequestService } from '@services/call-request.service';
import { CallRequestInterceptor } from '@model-interceptors/call-request-interceptor';
import { AdminResult } from '@models/admin-result';
import { PersonDetails } from '@models/person-details';
import { CustomValidators } from '@validators/custom-validators';
import { Observable } from 'rxjs';
import { CallRequestStatus } from '@enums/call-request-status';

const { send, receive } = new CallRequestInterceptor();

@InterceptModel({ send, receive })
export class CallRequest extends BaseModel<CallRequest, CallRequestService> {
  $$__service_name__$$ = 'CallRequestService';
  caseId!: string;
  investigationFullSerial!: string;
  summonedId!: number;
  summonedType!: number;
  summonDate!: string | Date;
  summonTime!: string | number | Date;
  summons!: string;
  summonsPlace!: string;
  note!: string;
  createdBy!: number;
  isApologize!: boolean;
  apologyReason!: string;
  apologyReasonId!: number;
  apologyReasonDate!: string;
  apologyReasonInfo!: AdminResult;
  statusDateModified!: AdminResult;
  typeInfo!: AdminResult;
  summonInfo!: PersonDetails;
  summonTypeInfo!: AdminResult;
  createdByInfo!: AdminResult;

  buildForm(controls = false): object {
    const { note, summonsPlace, summonTime, summonDate } = this;

    return {
      note: controls
        ? [note, [CustomValidators.required, CustomValidators.maxLength(1300)]]
        : note,
      summonsPlace: controls
        ? [
            summonsPlace,
            [CustomValidators.required, CustomValidators.maxLength(300)],
          ]
        : summonsPlace,
      summonTime: controls
        ? [summonTime, [CustomValidators.required]]
        : summonTime,
      summonDate: controls
        ? [summonDate, [CustomValidators.required]]
        : summonDate,
    };
  }

  updateStatus(status: CallRequestStatus): Observable<CallRequest> {
    this.status = status;
    return this.update();
  }
}
