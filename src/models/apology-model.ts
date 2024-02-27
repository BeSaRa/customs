import { InterceptModel } from 'cast-response';
import { ApologyModelInterceptor } from '@model-interceptors/apology-model-interceptor';
import { CustomValidators } from '@validators/custom-validators';

const { send, receive } = new ApologyModelInterceptor();

@InterceptModel({ send, receive })
export class ApologyModel {
  apologyReasonId!: number;
  apologyReason!: string;
  apologyReasonDate!: string;
  buildForm() {
    return {
      apologyReasonId: [null, CustomValidators.required],
      apologyReason: [
        '',
        [CustomValidators.required, CustomValidators.maxLength(1300)],
      ],
      apologyReasonDate: [null, CustomValidators.required],
    };
  }
}
