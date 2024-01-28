import { TaskDetails } from './task-details';
import { AdminResult } from '@models/admin-result';
import { BaseCaseService } from '@abstracts/base-case.service';
import { HasServiceMixin } from '@mixins/has-service-mixin';
import { ClonerMixin } from '@mixins/cloner-mixin';
import { CloneContract } from '@contracts/clone-contract';
import { Observable } from 'rxjs';
import { CaseTypes } from '@enums/case-types';
import { BaseCaseContract } from '@contracts/base-case-contract';
import { CommonCaseStatus } from '@enums/common-case-status';
import { TaskResponses } from '@enums/task-responses';
import { ActionNames } from '@enums/action-names';
import { TaskName } from '@enums/task-name';
import { HasServiceNameContract } from '@contracts/has-service-name-contract';
import { map } from 'rxjs/operators';

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

  caseStatus!: CommonCaseStatus;
  caseType!: CaseTypes;
  securityLevel!: number;
  departmentId!: number;
  sectionId!: number;
  taskDetails!: TaskDetails;
  departmentInfo!: AdminResult;
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
    return this.taskDetails?.responses;
  }

  getCaseStatus() {
    return this.caseStatus;
  }

  hasResponse(responses: TaskResponses) {
    return this.getResponses() && this.getResponses().includes(responses);
  }

  hasAnyResponse(response: string[]): boolean {
    return this.getResponses()?.some(i => {
      return response.includes(i);
    });
  }

  isCancelled(): boolean {
    return this.caseStatus === CommonCaseStatus.CANCELLED;
  }

  isReturned(): boolean {
    return this.caseStatus === CommonCaseStatus.RETURNED;
  }

  canSave(): boolean {
    return true;
  }

  getTaskName() {
    return this.taskDetails?.name;
  }

  isPresidentAssistantReview() {
    return this.getTaskName() === TaskName.PA_REV;
  }

  canClaim(): boolean {
    return (
      this.taskDetails &&
      this.taskDetails.actions.includes(ActionNames.ACTION_CLAIM)
    );
  }

  canRelease(): boolean {
    return (
      this.taskDetails &&
      this.taskDetails.actions.includes(ActionNames.ACTION_CANCELCLAIM)
    );
  }

  isClaimed(): boolean {
    return this.canRelease();
  }

  hasComplete(): boolean {
    return (
      this?.isClaimed() &&
      (!this.getResponses().length ||
        this.getResponses().includes(TaskResponses.COMPLETE)) &&
      this.caseStatus !== CommonCaseStatus.CANCELLED
    );
  }

  canCommit(): boolean {
    return this.caseStatus === CommonCaseStatus.DRAFT;
  }

  canStart(): boolean {
    return this.caseStatus === CommonCaseStatus.NEW;
  }

  claim(): Observable<Model> {
    return this.getService().claimTask(this.taskDetails.tkiid);
  }

  release(): Observable<Model> {
    return this.getService()
      .releaseBulk([this.taskDetails.tkiid])
      .pipe(
        map(() => {
          this.taskDetails.owner = null;
          this.taskDetails.actions = [ActionNames.ACTION_CLAIM].concat(
            this.taskDetails.actions.filter(
              a => a !== ActionNames.ACTION_CANCELCLAIM,
            ),
          );
          console.log('AFTER RELEASE', this);
          return this as unknown as Model;
        }),
      );
  }

  save(): Observable<Model> {
    return this.id
      ? this.getService().update(this as unknown as Model)
      : this.getService().create(this as unknown as Model);
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
