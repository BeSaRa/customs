import { ModelInterceptorContract } from 'cast-response';
import { JobTitle } from '@models/job-title';

export class JobTitleInterceptor implements ModelInterceptorContract<JobTitle> {
  send(model: Partial<JobTitle>): Partial<JobTitle> {
    return model;
  }

  receive(model: JobTitle): JobTitle {
    return model;
  }
}
