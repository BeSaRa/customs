import { BaseModel } from '@abstracts/base-model';
import { JobTitleService } from '@services/job-title.service';
import { JobTitleInterceptor } from '@model-interceptors/job-title-interceptor';
import { InterceptModel } from 'cast-response';
import { CustomValidators } from '@validators/custom-validators';
import { StatusTypes } from '@enums/status-types';
import { AdminResult } from '@models/admin-result';

const { send, receive } = new JobTitleInterceptor();

@InterceptModel({ send, receive })
export class JobTitle extends BaseModel<JobTitle, JobTitleService> {
  $$__service_name__$$ = 'JobTitleService';

  isSystem!: boolean;

  // statusInfo!: AdminResult;
  typeInfo!: AdminResult;

  override status = StatusTypes.ACTIVE;

  buildForm(controls = false): object {
    const { arName, enName, status } = this;
    return {
      arName: controls ? [arName, [CustomValidators.required, CustomValidators.maxLength(50), CustomValidators.pattern('AR_NUM')]] : arName,
      enName: controls ? [enName, [CustomValidators.required, CustomValidators.maxLength(50), CustomValidators.pattern('ENG_NUM')]] : enName,
      status: controls ? [status, CustomValidators.required] : status,
    };
  }

  isEditable(): boolean {
    return this.status !== StatusTypes.DELETED && !this.isSystem;
  }
}
