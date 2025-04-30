import { BaseCaseService } from '@abstracts/base-case.service';
import {
  EventEmitter,
  inject,
  Injectable,
  InputSignal,
  WritableSignal,
} from '@angular/core';
import { Constructor } from '@app-types/constructors';
import { ServiceContract } from '@contracts/service-contract';
import { Investigation } from '@models/investigation';
import {
  CastResponse,
  CastResponseContainer,
  HasInterception,
  InterceptParam,
} from 'cast-response';

import { HttpParams } from '@angular/common/http';
import { MatDialogRef } from '@angular/material/dialog';
import { ReportType } from '@app-types/validation-return-type';
import { LangKeysContract } from '@contracts/lang-keys-contract';
import { OperationType } from '@enums/operation-type';
import { TaskResponses } from '@enums/task-responses';
import { MeetingInterceptor } from '@model-interceptors/meeting-interceptor';
import { BlobModel } from '@models/blob-model';
import { CaseAttachment } from '@models/case-attachment';
import { DecisionMinutes } from '@models/decision-minutes';
import { DeclarationNumberDetailsResult } from '@models/declaration-number-details-result';
import { Meeting } from '@models/meeting';
import { MeetingMinutes } from '@models/meeting-minutes';
import { Memorandum } from '@models/memorandum';
import { OffenceNumberDetailsResult } from '@models/offence-number-details-result';
import { SuspendEmployee } from '@models/suspend-employee';
import { Violation } from '@models/violation';
import { ViolationService } from '@services/violation.service';
import { MemorandumPopupComponent } from '@standalone/popups/memorandum-popup/memorandum-popup.component';
import { ViolationPopupComponent } from '@standalone/popups/violation-popup/violation-popup.component';
import { b64toBlob } from '@utils/utils';
import { map, Observable } from 'rxjs';
import { InvestigationReport } from '@models/investigation-report';

@CastResponseContainer({
  $default: {
    model: () => Investigation,
  },
  suspend: {
    model: () => SuspendEmployee,
  },
  $meeting: {
    model: () => Meeting,
  },
  $meetingMinutes: {
    model: () => MeetingMinutes,
  },
  $decisionMinutes: {
    model: () => DecisionMinutes,
  },
})
@Injectable({
  providedIn: 'root',
})
export class InvestigationService
  extends BaseCaseService<Investigation>
  implements ServiceContract
{
  serviceKey: keyof LangKeysContract = 'menu_investigation';
  serviceName = 'InvestigationService';
  violationService = inject(ViolationService);

  getUrlSegment(): string {
    return this.urlService.URLS.INVESTIGATION;
  }

  getModelInstance(): Investigation {
    return new Investigation();
  }

  getModelClass(): Constructor<Investigation> {
    return Investigation;
  }

  openAddViolation(
    model: InputSignal<Investigation>,
    askForSaveModel: EventEmitter<void>,
    reportType: InputSignal<ReportType>,
    violationsList: Violation[],
  ): MatDialogRef<ViolationPopupComponent> {
    return this.violationService.openCreateDialog(undefined, {
      model,
      askForSaveModel,
      reportType,
      violationsList,
    });
  }

  @CastResponse(() => Investigation, { unwrap: 'rs', fallback: 'suspend' })
  suspendEmployee(body: SuspendEmployee) {
    return this.http.post(this.getUrlSegment() + '/suspend-employee', body);
  }

  @CastResponse(() => Investigation, { unwrap: 'rs', fallback: 'suspend' })
  extendSuspendEmployee(body: SuspendEmployee) {
    return this.http.post(
      this.getUrlSegment() + '/extend-suspend-employee',
      body,
    );
  }

  getDeclarationDetails(declarationNumber: string): Observable<{
    blob: BlobModel;
    title: string;
    status: string;
  }> {
    return this._getDeclarationDetails(declarationNumber).pipe(
      map(payload => {
        return {
          blob: new BlobModel(
            b64toBlob(payload.declarationAttachmentPDF, 'application/pdf'),
            this.domSanitizer,
          ),
          title: payload.declarationNumber,
          status: payload.status,
        };
      }),
    );
  }

  @CastResponse(() => DeclarationNumberDetailsResult, { unwrap: 'rs' })
  private _getDeclarationDetails(
    declarationNumber: string,
  ): Observable<DeclarationNumberDetailsResult> {
    return this.http.get<DeclarationNumberDetailsResult>(
      this.getUrlSegment() + `/nadeeb/declaration-details`,
      {
        params: new HttpParams({
          fromObject: {
            declarationNumber: decodeURIComponent(declarationNumber),
          },
        }),
      },
    );
  }
  @CastResponse(() => InvestigationReport, { unwrap: 'rs' })
  loadInvestigationReportVersions(
    vsid: string,
  ): Observable<InvestigationReport[]> {
    return this.http.get<InvestigationReport[]>(
      this.getUrlSegment() + `/document/${vsid}/versions`,
    );
  }

  updateIsExportable(
    vsId: string,
    isExportable: boolean,
    isAdminReport: boolean = false,
    isObligationToAttend: boolean = false,
  ) {
    return this.http.put(
      this.getUrlSegment() + '/document/isExportable',
      null,
      {
        params: {
          vsId,
          isExportable,
          isAdminReport,
          isObligationToAttend,
        },
      },
    );
  }

  getOffenceDetails(
    offenceNumber: string,
  ): Observable<{ blob: BlobModel; title: string; status: string }> {
    return this._getOffenceDetails(offenceNumber).pipe(
      map(payload => {
        return {
          blob: new BlobModel(
            b64toBlob(payload.offenceAttachmentPDF, 'application/pdf'),
            this.domSanitizer,
          ),
          title: payload.offenceNumber,
          status: payload.status,
        };
      }),
    );
  }

  @CastResponse(() => OffenceNumberDetailsResult, { unwrap: 'rs' })
  private _getOffenceDetails(
    offenceNumber: string,
  ): Observable<OffenceNumberDetailsResult> {
    return this.http.get<OffenceNumberDetailsResult>(
      this.getUrlSegment() + `/nadeeb/offence-details`,
      {
        params: new HttpParams({
          fromObject: {
            offenceNumber: decodeURIComponent(offenceNumber),
          },
        }),
      },
    );
  }

  addDisciplinaryDecision(penaltyDecisionId: number) {
    return this.http.post(
      this.getUrlSegment() + '/document/dc/decision',
      {},
      {
        params: new HttpParams({
          fromObject: { penaltyDecisionId },
        }),
      },
    );
  }
  requestPenaltyModification(decisionSerial: string) {
    const params = new HttpParams().set('decisionSerial', decisionSerial);

    return this.http.post(
      this.getUrlSegment() + '/penalty-modification/start',
      {},
      { params },
    );
  }

  @CastResponse(() => DecisionMinutes, {
    unwrap: 'rs',
    fallback: '$decisionMinutes',
  })
  getDisciplinaryDecisions(caseId: string): Observable<DecisionMinutes[]> {
    return this.http.get<DecisionMinutes[]>(
      this.getUrlSegment() + '/document/dc/decision',
      {
        params: new HttpParams({
          fromObject: { caseId },
        }),
      },
    );
  }

  @CastResponse(() => MeetingMinutes, { unwrap: 'rs', fallback: '$meeting' })
  @HasInterception
  addMeetingMinutes(
    @InterceptParam(new MeetingInterceptor().send) body: Meeting,
  ) {
    return this.http.post(
      this.getUrlSegment() + '/document/dc/meeting-minutes',
      body,
    );
  }

  @CastResponse(() => MeetingMinutes, {
    unwrap: 'rs',
    fallback: '$meetingMinutes',
  })
  getMeetingsMinutes(caseId: string): Observable<MeetingMinutes[]> {
    return this.http.get<MeetingMinutes[]>(
      this.getUrlSegment() + '/document/dc/meeting-minutes',
      {
        params: new HttpParams({
          fromObject: { caseId },
        }),
      },
    );
  }

  reviewTaskMeetingMinutes(
    tkiid: string,
    meetingId: number,
    isUpdate: boolean = false,
  ): Observable<MeetingMinutes> {
    return this.http.post<MeetingMinutes>(
      this.getUrlSegment() + '/review-task/dc/meeting-minutes',
      {},
      {
        params: new HttpParams({
          fromObject: {
            tkiid,
            meetingId,
            isUpdate,
          },
        }),
      },
    );
  }

  reviewTaskDecision(
    tkiid: string,
    penaltyDecisionId: number,
    offenderId: number,
    isUpdate: boolean = false,
  ) {
    return this.http.post<CaseAttachment[]>(
      this.getUrlSegment() + '/review-task/dc/decision',
      {},
      {
        params: new HttpParams({
          fromObject: {
            tkiid,
            penaltyDecisionId,
            offenderId,
            isUpdate,
          },
        }),
      },
    );
  }

  getDecisionFileAttachments(vsid: string): Observable<BlobModel> {
    return this.http
      .get(this.getUrlSegment() + `/document/latest/${vsid}/content`, {
        responseType: 'blob',
      })
      .pipe(map(blob => new BlobModel(blob, this.domSanitizer)));
  }

  @CastResponse(() => Memorandum)
  createMemorandum(model: Memorandum): Observable<Memorandum> {
    return this.http.post<Memorandum>(
      this.getUrlSegment() + '/document/inv-result',
      model,
    );
  }

  @CastResponse(() => Memorandum)
  updateMemorandum(model: Memorandum): Observable<Memorandum> {
    return this.http.put<Memorandum>(
      this.getUrlSegment() + '/document/inv-result',
      model,
    );
  }

  approveMemorandum(docId: string): Observable<unknown> {
    return this.http.post(
      this.getUrlSegment() + '/document/inv-result/approve',
      {},
      {
        params: new HttpParams({
          fromObject: { docId },
        }),
      },
    );
  }

  @CastResponse(() => Memorandum)
  loadMemorandums(caseId: string): Observable<Memorandum[]> {
    return this.http.get<Memorandum[]>(
      this.getUrlSegment() + '/document/inv-result',
      {
        params: new HttpParams({
          fromObject: { caseId },
        }),
      },
    );
  }

  openCreateMemorandumDialog(
    investigationModel: Investigation,
    updateModel: InputSignal<EventEmitter<void>>,
  ) {
    return this.dialog.open(MemorandumPopupComponent, {
      data: {
        investigationModel,
        model: new Memorandum().clone<Memorandum>({
          requestCaseId: investigationModel.id,
          decisionFullSerial: investigationModel.getReferralNumber(),
        }),
        operation: OperationType.CREATE,
        updateModel,
      },
    });
  }

  openEditMemorandumDialog(
    model: Memorandum,
    investigationModel: Investigation,
    updateModel:
      | InputSignal<EventEmitter<void>>
      | WritableSignal<EventEmitter<void>>,
    response?: TaskResponses,
  ) {
    return this.dialog.open(MemorandumPopupComponent, {
      data: {
        investigationModel,
        model,
        operation: OperationType.UPDATE,
        updateModel,
        response,
      },
    });
  }

  askForDepartmentReview(
    taskId: string,
    organizationIds: number[],
  ): Observable<unknown> {
    return this.http.post(
      this.getUrlSegment() + `/la-review/${taskId}/start`,
      organizationIds,
    );
  }
}
