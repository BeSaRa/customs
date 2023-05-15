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

  jobType!: number;
  isSystem!: boolean;

  // statusInfo!: AdminResult;
  typeInfo!: AdminResult;

  override status = StatusTypes.ACTIVE;

  buildForm(controls = false): object {
    const { arName, enName, status, jobType } = this;
    return {
      arName: controls ? [arName, CustomValidators.required] : arName,
      enName: controls ? [enName, CustomValidators.required] : enName,
      status: controls ? [status, CustomValidators.required] : status,
      jobType: controls ? [jobType, CustomValidators.required] : jobType,
    };
  }

  isEditable(): boolean {
    return this.status !== StatusTypes.DELETED && !this.isSystem;
  }
}
