import { BaseModel } from '@abstracts/base-model';
import { InvestigationReportService } from '@services/investigation-report.service';
import { AdminResult } from '@models/admin-result';
import { InvestigationReportInterceptor } from '@model-interceptors/investigation-report-interceptor';
import { InterceptModel } from 'cast-response';
import { Question } from '@models/question';
import { Observable, tap } from 'rxjs';
import { BlobModel } from '@models/blob-model';
import { downloadLink } from '@utils/utils';
import { ReportStatus } from '@enums/report-status';
import { InvestigationAttendance } from '@models/investigation-attendance';

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
  comment!: string;
  summonedTypeInfo!: AdminResult;
  summonedInfo!: AdminResult;
  attendanceList: InvestigationAttendance[] = [];
  category!: number;
  createdBy!: number;
  createdOn!: string;
  creatorInfo!: AdminResult;
  location?: string;
  documentVsId?: string;
  vsId?: string;
  isExportable?: boolean;
  override status: number = 1;

  download(download = true): Observable<BlobModel> {
    return this.$$getService$$<InvestigationReportService>()
      .downloadReport(this.id)
      .pipe(tap(value => download && downloadLink(value.url)))
      .pipe(tap(value => value.dispose()));
  }

  upload(file: File) {
    return this.$$getService$$<InvestigationReportService>().uploadReport(
      file,
      {
        vsId: this.documentVsId!,
      },
    );
  }

  // view(): Observable<MatDialogRef<ViewAttachmentPopupComponent>> {
  //   return this.$$getService$$<InvestigationReportService>().viewReport(
  //     this.id,
  //     this.getLangService().map.investigation_report,
  //   );
  // }

  isDraft(): boolean {
    return this.status === ReportStatus.DRAFT;
  }

  isApproved(): boolean {
    return this.status === ReportStatus.APPROVED;
  }

  hasDocumentVsId(): boolean {
    return !!this.documentVsId;
  }
  hasComment(): boolean {
    return !!this.comment;
  }
}
