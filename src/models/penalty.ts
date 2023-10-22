import { BaseModel } from '@abstracts/base-model';
import { PenaltyService } from '@services/penalty.service';
import { PenaltyInterceptor } from '@model-interceptors/penalty-interceptor';
import { InterceptModel } from 'cast-response';
import { CustomValidators } from '@validators/custom-validators';
import { StatusTypes } from '@enums/status-types';
import { AdminResult } from './admin-result';
import { PenaltyDetails } from './penalty-details';

const { send, receive } = new PenaltyInterceptor();

@InterceptModel({ send, receive })
export class Penalty extends BaseModel<Penalty, PenaltyService> {
  $$__service_name__$$ = 'PenaltyService';
  offenderType!: number;
  offenderTypeInfo!: AdminResult;
  isSystem = false;
  penaltyKey = 0;
  penaltyWeight!: number;
  isDeduction = false;
  erasureDuration!: number;
  deductionDays!: number;
  isCash = false;
  cashAmount!: number;
  override status = StatusTypes.ACTIVE;
  detailsList!: PenaltyDetails[];

  // extras
  repeat!: number;
  violationTypeInfo!: AdminResult;
  penGuidanceInfo!: AdminResult;
  penGuidance!: number;

  buildForm(controls = false): object {
    const { arName, enName, offenderType, status, penaltyWeight, isDeduction, deductionDays, erasureDuration, isCash, cashAmount } = this;
    return {
      arName: controls ? [arName, [CustomValidators.required, CustomValidators.maxLength(50), CustomValidators.pattern('AR_NUM')]] : arName,
      enName: controls ? [enName, [CustomValidators.required, CustomValidators.maxLength(50), CustomValidators.pattern('ENG_NUM')]] : enName,
      offenderType: controls ? [offenderType, CustomValidators.required] : offenderType,
      status: controls ? [status, CustomValidators.required] : status,
      penaltyWeight: controls ? [penaltyWeight, CustomValidators.required] : penaltyWeight,
      erasureDuration: controls ? [erasureDuration, CustomValidators.required] : erasureDuration,
      isDeduction: controls ? [isDeduction, CustomValidators.required] : isDeduction,
      deductionDays: controls ? [deductionDays] : deductionDays,
      isCash: controls ? [isCash, CustomValidators.required] : isCash,
      cashAmount: controls ? [cashAmount] : cashAmount,
    };
  }
}
