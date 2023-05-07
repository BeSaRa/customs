import { BaseModel } from '@abstracts/base-model';
import { JobTitleService } from '@services/job-title.service';
import { JobTitleInterceptor } from '@model-interceptors/job-title-interceptor';
import { InterceptModel } from 'cast-response';
import { CustomValidators } from '@validators/custom-validators';

const { send, receive } = new JobTitleInterceptor();

@InterceptModel({ send, receive })
export class JobTitle extends BaseModel<JobTitle, JobTitleService> {
  $$__service_name__$$ = 'JobTitleService';
  jobType!: number;
  status!: number;
  isSystem!: boolean;

  buildForm(controls = false): object {
    const { arName, enName, status, jobType } = this;
    return {
      arName: controls ? [arName, CustomValidators.required] : arName,
      enName: controls ? [enName, CustomValidators.required] : enName,
      status: controls ? [status, CustomValidators.required] : status,
      jobType: controls ? [jobType, CustomValidators.required] : jobType,
    };
  }
}
