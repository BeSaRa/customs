import { BaseModel } from '@abstracts/base-model';
import { PenaltyService } from '@services/penalty.service';
import { PenaltyInterceptor } from '@model-interceptors/penalty-interceptor';
import { InterceptModel } from 'cast-response';
import { CustomValidators } from '@validators/custom-validators';
import { StatusTypes } from '@enums/status-types';
import { AdminResult } from './admin-result';
import { FormGroup, Validators } from '@angular/forms';
import { patternValidator } from '@validators/validation-utils';

const { send, receive } = new PenaltyInterceptor();

@InterceptModel({ send, receive })
export class Penalty extends BaseModel<Penalty, PenaltyService> {
  $$__service_name__$$ = 'PenaltyService';
  offenderType!: number;
  offenderTypeInfo!: AdminResult;
  penaltyGracePeriod!: number;
  isSystem!: boolean;
  penaltyWeight!: number;
  isDeduction: boolean = false;
  deductionDays!: number;
  isCash: boolean = false;
  cashAmount!: number;
  override status = StatusTypes.ACTIVE;

  buildForm(controls = false): object {
    const { arName, enName, penaltyGracePeriod, offenderType, status, penaltyWeight, isDeduction, deductionDays } = this;
    return {
      arName: controls ? [arName, CustomValidators.required] : arName,
      enName: controls ? [enName, CustomValidators.required] : enName,
      penaltyGracePeriod: controls ? [penaltyGracePeriod, CustomValidators.required] : penaltyGracePeriod,
      offenderType: controls ? [offenderType, CustomValidators.required] : offenderType,
      status: controls ? [status, CustomValidators.required] : status,
      penaltyWeight: controls ? [penaltyWeight, CustomValidators.required] : penaltyWeight,
      isDeduction: controls ? [isDeduction, CustomValidators.required] : isDeduction,
      deductionDays: controls ? [deductionDays] : deductionDays,
      isCash: controls ? [isDeduction, CustomValidators.required] : isDeduction,
      cashAmount: controls ? [deductionDays] : deductionDays,
    };
  }
}
