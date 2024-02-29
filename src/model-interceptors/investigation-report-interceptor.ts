import { ModelInterceptorContract } from 'cast-response';
import { InvestigationReport } from '@models/investigation-report';
import { Question } from '@models/question';
import { AdminResult } from '@models/admin-result';

export class InvestigationReportInterceptor
  implements ModelInterceptorContract<InvestigationReport>
{
  send(model: Partial<InvestigationReport>): Partial<InvestigationReport> {
    delete model.creatorInfo;
    return model;
  }

  receive(model: InvestigationReport): InvestigationReport {
    model.statusInfo = AdminResult.createInstance(model.statusInfo);
    model.creatorInfo = AdminResult.createInstance(model.creatorInfo);
    model.detailsList = model.detailsList.map(item =>
      new Question().clone(item),
    );
    return model;
  }
}
