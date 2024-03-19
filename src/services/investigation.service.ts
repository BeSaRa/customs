import { EventEmitter, inject, Injectable, InputSignal } from '@angular/core';
import { BaseCaseService } from '@abstracts/base-case.service';
import { Constructor } from '@app-types/constructors';
import { ServiceContract } from '@contracts/service-contract';
import { Investigation } from '@models/investigation';
import { CastResponse, CastResponseContainer } from 'cast-response';

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
import { CaseAttachment } from '@models/case-attachment';

@CastResponseContainer({
  $default: {
    model: () => Investigation,
  },
  suspend: {
    model: () => SuspendEmployee,
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

  @CastResponse(() => CaseAttachment)
  getDecisionFileAttachments(vsid: string): Observable<CaseAttachment> {
    return this.http.get<CaseAttachment>(
      this.getUrlSegment() + `/document/latest/$${vsid}/content`,
    );
  }
}
