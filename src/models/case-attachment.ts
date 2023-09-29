import { AdminResult } from '@models/admin-result';
import { ClonerMixin } from '@mixins/cloner-mixin';
import { MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { BaseCaseService } from '@abstracts/base-case.service';

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

  view(service: BaseCaseService<unknown>): Observable<unknown> {
    return service.viewAttachment(this.id);
  }
}
