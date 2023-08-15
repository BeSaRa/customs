import { BaseModel } from '@abstracts/base-model';
import { PenaltyService } from '@services/penalty.service';
import { PenaltyInterceptor } from '@model-interceptors/penalty-interceptor';
import { InterceptModel } from 'cast-response';
import { CustomValidators } from '@validators/custom-validators';
import { StatusTypes } from '@enums/status-types';
import { AdminResult } from './admin-result';

const { send, receive } = new PenaltyInterceptor();

@InterceptModel({ send, receive })
export class Penalty extends BaseModel<Penalty, PenaltyService> {
  $$__service_name__$$ = 'PenaltyService';
  offenderType!: number;
  offenderTypeInfo!: AdminResult;
  isSystem: boolean = false;
  penaltyKey: number = 0;
  penaltyWeight!: number;
  isDeduction: boolean = false;
  erasureDuration!: number;
  deductionDays!: number;
  isCash: boolean = false;
  cashAmount!: number;
  override status = StatusTypes.ACTIVE;
  // detailsList!: PenaltyDetails[];

  buildForm(controls = false): object {
    const { arName, enName, offenderType, status, penaltyWeight, isDeduction, deductionDays, erasureDuration } = this;
    return {
      arName: controls ? [arName, CustomValidators.required] : arName,
      enName: controls ? [enName, CustomValidators.required] : enName,
      offenderType: controls ? [offenderType, CustomValidators.required] : offenderType,
      status: controls ? [status, CustomValidators.required] : status,
      penaltyWeight: controls ? [penaltyWeight, CustomValidators.required] : penaltyWeight,
      erasureDuration: controls ? [erasureDuration, CustomValidators.required] : erasureDuration,
      isDeduction: controls ? [isDeduction, CustomValidators.required] : isDeduction,
      deductionDays: controls ? [deductionDays] : deductionDays,
      isCash: controls ? [isDeduction, CustomValidators.required] : isDeduction,
      cashAmount: controls ? [deductionDays] : deductionDays,
    };
  }
}
