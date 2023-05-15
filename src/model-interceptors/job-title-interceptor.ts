import { ModelInterceptorContract } from 'cast-response';
import { JobTitle } from '@models/job-title';
import { AdminResult } from '@models/admin-result';

export class JobTitleInterceptor implements ModelInterceptorContract<JobTitle> {
  send(model: Partial<JobTitle>): Partial<JobTitle> {
    return model;
  }

  receive(model: JobTitle): JobTitle {
    model.statusInfo = new AdminResult().clone(model.statusInfo);
    model.typeInfo = new AdminResult().clone(model.typeInfo);
    return model;
  }
}
