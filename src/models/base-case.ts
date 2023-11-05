import { TaskDetails } from './task-details';
import { AdminResult } from '@models/admin-result';
import { BaseCaseService } from '@abstracts/base-case.service';
import { HasServiceMixin } from '@mixins/has-service-mixin';
import { HasServiceNameContract } from '@contracts/has-service-name-contract';
import { ClonerMixin } from '@mixins/cloner-mixin';
import { CloneContract } from '@contracts/clone-contract';
import { Observable } from 'rxjs';
import { CaseTypes } from '@enums/case-types';
import { BaseCaseContract } from '@contracts/base-case-contract';
import { CommonCaseStatus } from '@enums/common-case-status';
import { TaskResponses } from '@enums/task-responses';

export abstract class BaseCase<Service extends BaseCaseService<Model>, Model>
  extends HasServiceMixin(ClonerMixin(class {}))
  implements HasServiceNameContract, CloneContract, BaseCaseContract<Model>
{
  abstract override $$__service_name__$$: string;
  id!: string;
  createdBy!: string;
  createdOn!: Date | number | string;
  lastModified!: string;
  lastModifier!: string;
  classDescription!: string;
  creatorInfo!: AdminResult;
  ouInfo!: AdminResult;
  caseIdentifier!: number;
  caseState!: number;
  serial!: number;

  caseStatus!: number;
  caseType!: CaseTypes;
  securityLevel!: number;
  departmentId!: number;
  sectionId!: number;
  taskDetails!: TaskDetails;
  departmenttInfo!: AdminResult;
  sectionInfo!: AdminResult;
  caseStatusInfo!: AdminResult;
  className!: string;
  description!: string;

  getService(): Service {
    return super.$$getService$$<Service>();
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  abstract buildForm(): any;

  getCaseType(): number {
    return this.caseType;
  }
  getResponses() {
    return this.taskDetails.responses;
  }

  hasResponse(responses: TaskResponses) {
    return this.getResponses().includes(responses);
  }
  isCancelled(): boolean {
    return this.caseStatus === CommonCaseStatus.CANCELLED;
  }
  isReturned(): boolean {
    return this.caseStatus === CommonCaseStatus.RECEIVED;
  }
  canSave(): boolean {
    return !this.isCancelled() && this.isReturned();
  }
  canClaim(): boolean {
    return true;
  }
  isClaimed(): boolean {
    return false;
  }
  canStart(): boolean {
    return this.caseStatus === CommonCaseStatus.NEW;
  }

  claim(): Observable<Model> {
    return this.getService().claimTask(this.taskDetails.tkiid);
  }
  save(): Observable<Model> {
    return this.id ? this.getService().update(this as unknown as Model) : this.getService().create(this as unknown as Model);
  }

  draft(): Observable<Model> {
    return this.getService().draft(this as unknown as Model);
  }

  commit(): Observable<Model> {
    return this.getService().commit(this as unknown as Model);
  }

  details(caseId: string): Observable<Model> {
    return this.getService().getDetails(caseId);
  }

  start(): Observable<boolean> {
    return this.getService().start(this.id);
  }
}
