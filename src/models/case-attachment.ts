import { AdminResult } from '@models/admin-result';
import { ClonerMixin } from '@mixins/cloner-mixin';
import { MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { BaseCaseService } from '@abstracts/base-case.service';
import { ViewAttachmentPopupComponent } from '@standalone/popups/view-attachment-popup/view-attachment-popup.component';
import { CaseAttachmentInterceptor } from '@model-interceptors/case-attachment-interceptor';
import { InterceptModel } from 'cast-response';
import { AttachmentTypes } from '@enums/attachment-type.enum';

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
  ): Observable<MatDialogRef<ViewAttachmentPopupComponent>> {
    return service.viewAttachment(this.vsId, this.mimeType);
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
