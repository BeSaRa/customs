import { AdminResult } from '@models/admin-result';
import { ClonerMixin } from '@mixins/cloner-mixin';
import { MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { BaseCaseService } from '@abstracts/base-case.service';
import { ViewAttachmentPopupComponent } from '@standalone/popups/view-attachment-popup/view-attachment-popup.component';
import { CaseAttachmentInterceptor } from '@model-interceptors/case-attachment-interceptor';
import { InterceptModel } from 'cast-response';
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
  attachmentTypeInfo!: AdminResult;
  // not related to the model

  content?: File;

  setContent(file: File): void {
    this.content = file;
  }

  view(service: BaseCaseService<unknown>): Observable<MatDialogRef<ViewAttachmentPopupComponent>> {
    return service.viewAttachment(this.id);
  }

  delete(service: BaseCaseService<unknown>): Observable<unknown> {
    return service.deleteAttachment(this.id);
  }
}
