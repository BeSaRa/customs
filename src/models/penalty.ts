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
  override arName!: string;
  override enName!: string;
  penaltyType!: number;
  isSystem = true;

  override status = StatusTypes.ACTIVE;

  buildForm(controls = false): object {
    const { arName, enName, penaltyType, status } = this;
    return {
      arName: controls ? [arName, CustomValidators.required] : arName,
      enName: controls ? [enName, CustomValidators.required] : enName,
      penaltyType: controls
        ? [penaltyType, CustomValidators.required]
        : penaltyType,
      status: controls ? [status, CustomValidators.required] : status,
    };
  }
}
