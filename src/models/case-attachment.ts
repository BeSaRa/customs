import { AdminResult } from '@models/admin-result';
import { ClonerMixin } from '@mixins/cloner-mixin';
import { MatDialogRef } from '@angular/material/dialog';
import { Observable, tap } from 'rxjs';
import { BaseCaseService } from '@abstracts/base-case.service';
import { ViewAttachmentPopupComponent } from '@standalone/popups/view-attachment-popup/view-attachment-popup.component';
import { CaseAttachmentInterceptor } from '@model-interceptors/case-attachment-interceptor';
import { InterceptModel } from 'cast-response';
import { AttachmentTypes } from '@enums/attachment-type.enum';
import { map } from 'rxjs/operators';

const { send, receive } = new CaseAttachmentInterceptor();

@InterceptModel({
  send,
  receive,
})
export class CaseAttachment extends ClonerMixin(class {}) {
  id!: string;
  createdBy!: string;
  createdOn!: Date | string;
  lastModified!: Date | string;
  lastModifier!: string;
  classDescription!: string;
  creatorInfo!: AdminResult;
  ouInfo!: AdminResult;
  mimeType!: string;
  documentTitle!: string;
  contentSize!: number;
  minorVersionNumber!: number;
  majorVersionNumber!: number;
  vsId!: string;
  versionStatus!: number;
  isCurrent!: true;
  lockTimeout!: string;
  lockOwner!: string;
  attachmentTypeId!: number;
  description!: string;
  isApproved!: boolean;
  isExportable!: boolean;
  isLegal!: boolean;
  attachmentTypeInfo!: AdminResult;
  employeeNo!: number;
  // not related to the model

  content?: File;

  setContent(file: File): void {
    this.content = file;
  }

  view(
    service: BaseCaseService<unknown>,
  ): Observable<MatDialogRef<ViewAttachmentPopupComponent> | void> {
    if (
      this.mimeType === 'application/pdf' ||
      this.mimeType.startsWith('image')
    ) {
      return service.viewAttachment(this.vsId, this.mimeType);
    } else {
      return service.downloadAttachment(this.vsId).pipe(
        tap(blob => {
          const url = window.URL.createObjectURL(blob.blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'document';
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          window.URL.revokeObjectURL(url);
        }),
        map(() => void 0),
      );
    }
  }

  updateAttachmentTitle(
    service: BaseCaseService<unknown>,
    newTitle: string,
    isExternal: boolean,
  ) {
    return service.updateAttachmentTitle(this, newTitle, isExternal);
  }

  delete(service: BaseCaseService<unknown>): Observable<unknown> {
    return service.deleteAttachment(this.id);
  }

  isInvestigationReportOpinion() {
    return (
      this.attachmentTypeId === AttachmentTypes.INVESTIGATION_REPORT_OPINION
    );
  }

  isAdministrativeInvestigation() {
    return (
      this.attachmentTypeId === AttachmentTypes.ADMINISTRATIVE_INVESTIGATION
    );
  }

  isInvestigationResult() {
    return this.attachmentTypeId === AttachmentTypes.INVESTIGATION_RESULT;
  }
}
