import { BaseModel } from '@abstracts/base-model';
import { InvestigationReportService } from '@services/investigation-report.service';
import { AdminResult } from '@models/admin-result';
import { InvestigationReportInterceptor } from '@model-interceptors/investigation-report-interceptor';
import { InterceptModel } from 'cast-response';
import { Question } from '@models/question';
import { Observable } from 'rxjs';

const { send, receive } = new InvestigationReportInterceptor();

@InterceptModel({ send, receive })
export class InvestigationReport extends BaseModel<
  InvestigationReport,
  InvestigationReportService
> {
  override $$__service_name__$$: string = 'InvestigationReportService';
  caseId!: string;
  summonedType!: number;
  summonedId!: number;
  detailsList: Question[] = [];
  summonedTypeInfo!: AdminResult;
  summonedInfo!: AdminResult;
  category!: number;
  createdBy!: number;
  creatorInfo!: AdminResult;
  location?: string;
  override status: number = 1;

  download(): Observable<unknown> {
    return this.$$getService$$<InvestigationReportService>().downloadReport(
      this.id,
    );
  }
}
