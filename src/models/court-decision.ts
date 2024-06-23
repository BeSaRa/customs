import { CourtDecisionService } from '@services/court-decision.service';
import { BaseCase } from './base-case';
import { CustomValidators } from '@validators/custom-validators';
import { CourtDecisionInterceptor } from '@model-interceptors/court-decision-interceptor';
import { InterceptModel } from 'cast-response';

const { send, receive } = new CourtDecisionInterceptor();

@InterceptModel({ send, receive })
export class CourtDecision extends BaseCase<
  CourtDecisionService,
  CourtDecision
> {
  override $$__service_name__$$: string = 'CourtDecisionService';

  comment!: string;
  maxApplyDate!: string;
  penaltyId!: number;

  override buildForm() {
    return {
      comment: [
        '',
        [CustomValidators.required, CustomValidators.maxLength(3000)],
      ],
      maxApplyDate: ['', [CustomValidators.required]],
      penaltyId: [null, [CustomValidators.required]],
    };
  }
}
