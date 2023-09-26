import { AdminResult } from '@models/admin-result';
import { ClonerMixin } from '@mixins/cloner-mixin';

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
}
