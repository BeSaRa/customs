import { AdminResult } from '@models/admin-result';
import { BaseCaseService } from '@abstracts/base-case.service';
import { HasServiceMixin } from '@mixins/has-service-mixin';
import { HasServiceNameContract } from '@contracts/has-service-name-contract';

export abstract class BaseCase<Service extends BaseCaseService<Model>, Model> extends HasServiceMixin(class {}) implements HasServiceNameContract {
  abstract override $$__service_name__$$: string;
  id!: string;
  createdBy!: string;
  createdOn!: string;
  lastModified!: string;
  lastModifier!: string;
  classDescription!: string;
  creatorInfo!: AdminResult;
  ouInfo!: AdminResult;
  caseIdentifier!: number;
  caseState!: number;
  serial!: number;
  fullSerial!: number;
  caseStatus!: number;
  caseType!: number;
  securityLevel!: number;
  departmentId!: number;
  sectionId!: number;
  taskDetails!: number;
  departmenttInfo!: AdminResult;
  sectionInfo!: AdminResult;
  caseStatusInfo!: AdminResult;
  className!: string;

  getService(): Service {
    return super.$$getService$$<Service>();
  }
}
