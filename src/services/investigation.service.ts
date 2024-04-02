import { EventEmitter, inject, Injectable, InputSignal } from '@angular/core';
import { BaseCaseService } from '@abstracts/base-case.service';
import { Constructor } from '@app-types/constructors';
import { ServiceContract } from '@contracts/service-contract';
import { Investigation } from '@models/investigation';
import {
  CastResponse,
  CastResponseContainer,
  HasInterception,
  InterceptParam,
} from 'cast-response';

import { MatDialogRef } from '@angular/material/dialog';
import { ViolationPopupComponent } from '@standalone/popups/violation-popup/violation-popup.component';
import { ViolationService } from '@services/violation.service';
import { LangKeysContract } from '@contracts/lang-keys-contract';
import { SuspendEmployee } from '@models/suspend-employee';
import { ReportType } from '@app-types/validation-return-type';
import { map, Observable } from 'rxjs';
import { BlobModel } from '@models/blob-model';
import { DeclarationNumberDetailsResult } from '@models/declaration-number-details-result';
import { b64toBlob } from '@utils/utils';
import { OffenceNumberDetailsResult } from '@models/offence-number-details-result';
import { Violation } from '@models/violation';
import { Meeting } from '@models/meeting';
import { HttpParams } from '@angular/common/http';
import { CaseAttachment } from '@models/case-attachment';
import { MeetingInterceptor } from '@model-interceptors/meeting-interceptor';
import { Memorandum } from '@models/memorandum';
import { MemorandumPopupComponent } from '@standalone/popups/memorandum-popup/memorandum-popup.component';
import { OperationType } from '@enums/operation-type';

@CastResponseContainer({
  $default: {
    model: () => Investigation,
  },
  suspend: {
    model: () => SuspendEmployee,
  },
  meeting: {
    model: () => Meeting,
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

  getDeclarationDetails(
    declarationNumber: string,
  ): Observable<{ blob: BlobModel; title: string }> {
    return this._getDeclarationDetails(declarationNumber).pipe(
      map(payload => {
        return {
          blob: new BlobModel(
            b64toBlob(payload.declarationAttachmentPDF, 'application/pdf'),
            this.domSanitizer,
          ),
          title: payload.declarationNumber,
        };
      }),
    );
  }

  @CastResponse(() => DeclarationNumberDetailsResult, { unwrap: 'rs' })
  private _getDeclarationDetails(
    declarationNumber: string,
  ): Observable<DeclarationNumberDetailsResult> {
    return this.http.get<DeclarationNumberDetailsResult>(
      this.getUrlSegment() +
        `/nadeeb/declaration-details/${encodeURIComponent(declarationNumber)}`,
    );
  }

  getOffenceDetails(
    offenceNumber: string,
  ): Observable<{ blob: BlobModel; title: string }> {
    return this._getOffenceDetails(offenceNumber).pipe(
      map(payload => {
        return {
          blob: new BlobModel(
            b64toBlob(payload.offenceAttachmentPDF, 'application/pdf'),
            this.domSanitizer,
          ),
          title: payload.offenceNumber,
        };
      }),
    );
  }
  @CastResponse(() => OffenceNumberDetailsResult, { unwrap: 'rs' })
  private _getOffenceDetails(
    offenceNumber: string,
  ): Observable<OffenceNumberDetailsResult> {
    return this.http.get<OffenceNumberDetailsResult>(
      this.getUrlSegment() +
        `/nadeeb/offence-details/${encodeURIComponent(offenceNumber)}`,
    );
  }
  @CastResponse(() => Meeting, { unwrap: 'rs', fallback: 'meeting' })
  @HasInterception
  addMeetingMinutes(
    @InterceptParam(new MeetingInterceptor().send) body: Meeting,
  ) {
    return this.http.post(
      this.getUrlSegment() + '/document/dc/meeting-minutes',
      body,
    );
  }
  @CastResponse(() => Meeting, { unwrap: 'rs', fallback: 'meeting' })
  addDisciplinaryDecision(penaltyDecisionId: number) {
    return this.http.post(
      this.getUrlSegment() + '/document/dc/decisions',
      {},
      {
        params: new HttpParams({
          fromObject: { penaltyDecisionId },
        }),
      },
    );
  }

  @CastResponse(() => CaseAttachment)
  getDecisionFileAttachments(vsid: string): Observable<CaseAttachment> {
    return this.http.get<CaseAttachment>(
      this.getUrlSegment() + `/document/latest/$${vsid}/content`,
    );
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
    return this.http.post<Memorandum>(
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
    updateModel: InputSignal<EventEmitter<void>>,
  ) {
    return this.dialog.open(MemorandumPopupComponent, {
      data: {
        investigationModel,
        model,
        operation: OperationType.UPDATE,
        updateModel,
      },
    });
  }
}
