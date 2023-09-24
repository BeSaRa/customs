import { BaseModel } from '@abstracts/base-model';
import { ViolationTypeService } from '@services/violation-type.service';
import { ViolationTypeInterceptor } from '@model-interceptors/violation-type-interceptor';
import { InterceptModel } from 'cast-response';
import { CustomValidators } from '@validators/custom-validators';
import { AdminResult } from './admin-result';
import { StatusTypes } from '@enums/status-types';

const { send, receive } = new ViolationTypeInterceptor();

@InterceptModel({ send, receive })
export class ViolationType extends BaseModel<ViolationType, ViolationTypeService> {
  $$__service_name__$$ = 'ViolationTypeService';

  violationClassificationId!: number;
  offenderType!: number;
  isNumeric!: number;
  numericFrom!: number;
  numericTo!: number;
  absence!: number;
  criminalType!: number;
  responsibilityRepeatViolations!: number;
  level!: number;
  managerDecision!: number;

  typeInfo!: AdminResult;
  classificationInfo!: AdminResult;
  violationLevelInfo!: AdminResult;
  customsViolationEffectInfo!: AdminResult;
  managerDecisionInfo!: AdminResult;
  responsibilityRepeatViolationsInfo!: AdminResult;
  criminalTypeInfo!: AdminResult;

  override status = StatusTypes.ACTIVE;
  buildForm(controls = false): object {
    const {
      arName,
      enName,
      offenderType,
      violationClassificationId,
      status,
      isNumeric,
      numericFrom,
      numericTo,
      absence,
      criminalType,
      responsibilityRepeatViolations,
      managerDecision,
      level,
    } = this;
    return {
      arName: controls ? [arName, CustomValidators.required] : arName,
      enName: controls ? [enName, CustomValidators.required] : enName,
      violationClassificationId: controls ? [violationClassificationId, CustomValidators.required] : violationClassificationId,
      offenderType: controls ? [offenderType, CustomValidators.required] : offenderType,
      isNumeric: controls ? [isNumeric] : isNumeric,
      numericFrom: controls ? [numericFrom] : numericFrom,
      numericTo: controls ? [numericTo] : numericTo,
      absence: controls ? [absence] : absence,
      criminalType: controls ? [criminalType] : criminalType,
      responsibilityRepeatViolations: controls ? [responsibilityRepeatViolations] : responsibilityRepeatViolations,
      level: controls ? [level, CustomValidators.required] : level,
      managerDecision: controls ? [managerDecision, CustomValidators.required] : managerDecision,
      status: status,
    };
  }
}
