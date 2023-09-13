import { BaseModel } from '@abstracts/base-model';
import { ServiceStepsService } from '@services/service-steps.service';
import { ServiceStepsInterceptor } from '@model-interceptors/service-steps-interceptor';
import { InterceptModel } from 'cast-response';
import { CustomValidators } from '@validators/custom-validators';

const { send, receive } = new ServiceStepsInterceptor();

@InterceptModel({ send, receive })
export class ServiceSteps extends BaseModel<ServiceSteps, ServiceStepsService> {
  $$__service_name__$$ = 'ServiceStepsService';

  serviceId!: number;
  activityName!: string;
  stepName!: string;
  arDesc!: string;
  enDesc!: string;
  stepSLA!: number;

  loadSteps() {
    //return this.$$getService$$<ServiceStepsService>().stepsByServiceId(this.id);
  }

  buildForm(controls?: boolean) {
    const { arName, enName, arDesc, enDesc, stepName, activityName, stepSLA } = this;

    return {
      arName: controls ? [arName, [CustomValidators.required, CustomValidators.maxLength(50), CustomValidators.pattern('AR_NUM')]] : arName,
      enName: controls ? [enName, [CustomValidators.required, CustomValidators.maxLength(50), CustomValidators.pattern('ENG_NUM')]] : enName,
      arDesc: controls ? [{ value: arDesc, disabled: true }, [CustomValidators.required, CustomValidators.pattern('AR_NUM')]] : arDesc,
      enDesc: controls ? [{ value: enDesc, disabled: true }, [CustomValidators.required, CustomValidators.pattern('ENG_NUM')]] : enDesc,
      stepName: controls ? [{ value: stepName, disabled: true }] : stepName,
      activityName: controls ? [{ value: activityName, disabled: true }] : activityName,
      stepSLA: controls ? [stepSLA] : stepSLA,
    };
  }
}
