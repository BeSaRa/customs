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
import { HasServiceNameContract } from '@contracts/has-service-name-contract';
import { map } from 'rxjs/operators';
import { ServiceRegistry } from '@services/service-registry';
import { EmployeeService } from '@services/employee.service';
import { ActivitiesName } from '@enums/activities-name';

export abstract class BaseCase<Service extends BaseCaseService<Model>, Model>
  extends HasServiceMixin(ClonerMixin(class {}))
  implements HasServiceNameContract, CloneContract, BaseCaseContract<Model>
{
  abstract override $$__service_name__$$: string;
  id!: string;
  createdOn!: Date | number | string;
  creatorInfo!: AdminResult;
  ouInfo!: AdminResult;
  caseIdentifier!: number;
  caseState!: number;
  serial!: number;

  caseStatus!: CommonCaseStatus;
  caseType!: CaseTypes;
  securityLevel!: number;
  sectionId!: number;
  taskDetails!: TaskDetails;
  departmentInfo!: AdminResult;
  sectionInfo!: AdminResult;
  caseStatusInfo!: AdminResult;
  description!: string;

  $$__employeeService__$$ = 'EmployeeService';

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

  getTaskId(): string | undefined {
    return this.taskDetails && this.taskDetails.tkiid;
  }

  hasResponse(responses: TaskResponses) {
    return this.getResponses() && this.getResponses().includes(responses);
  }

  hasAnyResponse(response: string[]): boolean {
    return this.getResponses()?.some(i => {
      return response.includes(i);
    });
  }

  canSave(): boolean {
    return !this.id || this.canEdit();
  }

  canEdit() {
    return (
      this.getCaseStatus() === CommonCaseStatus.NEW ||
      this.getCaseStatus() === CommonCaseStatus.DRAFT ||
      this.getCaseStatus() === CommonCaseStatus.SENT ||
      this.getCaseStatus() === CommonCaseStatus.SENT_TO_MANAGER ||
      this.getCaseStatus() === CommonCaseStatus.SENT_TO_CHIEF ||
      this.getCaseStatus() === CommonCaseStatus.RETURNED_TO_SAME_OFFICER ||
      this.getCaseStatus() === CommonCaseStatus.RETURNED_TO_DEPARTMENT ||
      this.getCaseStatus() === CommonCaseStatus.CHIEF_COMPLETED ||
      this.getCaseStatus() === CommonCaseStatus.MANAGER_APPROVE ||
      this.getCaseStatus() ===
        CommonCaseStatus.REFERRALED_TO_PRESIDENT_ASSISTANT ||
      this.getCaseStatus() ===
        CommonCaseStatus.DISCIPLINARY_COUNCIL_MEMBER_APPROVED
    );
  }

  getTaskName() {
    return this.taskDetails?.name;
  }

  getActivityName(): '' | ActivitiesName | undefined {
    return (
      this.taskDetails &&
      this.taskDetails.processInstanceName &&
      (this.taskDetails.processInstanceName.split(
        ':',
      )[0] as unknown as ActivitiesName)
    );
  }

  canClaim(): boolean {
    return (
      this.taskDetails &&
      this.taskDetails.actions.includes(ActionNames.ACTION_CLAIM) &&
      this.getActivityName() !== ActivitiesName.REVIEW_DISCIPLINARY_COUNCIL
    );
  }

  canRelease(): boolean {
    return (
      this.taskDetails &&
      this.taskDetails.actions.includes(ActionNames.ACTION_CANCELCLAIM) &&
      !this.isCancelled()
    );
  }

  isCancelled(): boolean {
    return this.caseState === CommonCaseStatus.CANCELLED;
  }

  isReturned(): boolean {
    return false;
  }

  isClaimed(): boolean {
    return (
      this.canRelease() ||
      this.getActivityName() === ActivitiesName.REVIEW_DISCIPLINARY_COUNCIL
    );
  }

  getTeamAuthName() {
    return this.taskDetails?.assignedToDisplayName;
  }

  getTeamDisplayName(): string {
    return this.taskDetails.teamDisplayName;
  }

  $$getEmployeeService$$(): EmployeeService {
    return ServiceRegistry.get<EmployeeService>(this.$$__employeeService__$$);
  }

  inMyInbox(): boolean {
    return !!(
      this.taskDetails &&
      this.taskDetails.owner &&
      this.$$getEmployeeService$$().getEmployee()?.domainName.toLowerCase() ===
        this.taskDetails.owner.toLowerCase()
    );
  }

  hasComplete(): boolean {
    return (
      this?.inMyInbox() &&
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

  start(): Observable<boolean> {
    return this.getService().start(this.id);
  }

  isReviewStatement() {
    return (
      this.getActivityName() === ActivitiesName.REVIEW_DEPARTMENT_STATEMENT
    );
  }
  isReviewReferralWithdrawRequest() {
    return (
      this.getActivityName() === ActivitiesName.REVIEW_REFERRAL_WITHDRAW_REQUEST
    );
  }
}
