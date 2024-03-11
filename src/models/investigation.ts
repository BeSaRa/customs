import { BaseCase } from '@models/base-case';
import { InvestigationService } from '@services/investigation.service';
import { CaseTypes } from '@enums/case-types';
import { InterceptModel } from 'cast-response';
import { InvestigationInterceptor } from '@model-interceptors/Investigation-interceptor';
import { Offender } from './offender';
import { OffenderViolation } from './offender-violation';
import { Violation } from './violation';
import { AdminResult } from './admin-result';
import { CustomValidators } from '@validators/custom-validators';
import { ViolationDegreeConfidentiality } from '@enums/violation-degree-confidentiality.enum';
import { PenaltyDecision } from '@models/penalty-decision';
import { SystemPenalties } from '@enums/system-penalties';
import { OffenderTypes } from '@enums/offender-types';
import { ManagerDecisions } from '@enums/manager-decisions';
import { ProofTypes } from '@enums/proof-types';
import { ActivitiesName } from '@enums/activities-name';

const { send, receive } = new InvestigationInterceptor();

@InterceptModel({ send, receive })
export class Investigation extends BaseCase<
  InvestigationService,
  Investigation
> {
  override $$__service_name__$$: string = 'InvestigationService';
  override securityLevel = ViolationDegreeConfidentiality.SECRET;
  investigationFullSerial!: string;
  draftFullSerial!: string;
  draftSerial!: number;
  investigationSerial!: number;
  applicantDecision!: number;
  override caseType = CaseTypes.INVESTIGATION;
  override createdOn: Date | string = new Date();
  offenderInfo: Offender[] = [];
  offenderViolationInfo: OffenderViolation[] = [];
  violationInfo: Violation[] = [];
  penaltyDecisions: PenaltyDecision[] = [];
  securityLevelInfo?: AdminResult;
  isDrafted!: boolean;
  subject!: string;

  buildForm(controls = false, disabled = false): object {
    const {
      description,
      createdOn,
      investigationFullSerial,
      draftFullSerial,
      subject,
      securityLevel,
    } = this;
    return {
      draftFullSerial: controls
        ? [{ value: draftFullSerial, disabled: true }]
        : draftFullSerial,
      investigationFullSerial: controls
        ? [{ value: investigationFullSerial, disabled: true }]
        : investigationFullSerial,
      createdOn: controls ? [{ value: createdOn, disabled: true }] : createdOn,
      description: controls
        ? [
            { value: description, disabled: disabled },
            [CustomValidators.maxLength(1333)],
          ]
        : description,
      securityLevel: controls
        ? [
            // this must handle depending on a permission
            { value: securityLevel, disabled: disabled },
            CustomValidators.required,
          ]
        : securityLevel,
      subject: controls
        ? [
            { value: subject, disabled: disabled },
            [CustomValidators.required, CustomValidators.maxLength(1024)],
          ]
        : subject,
    };
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

  hasTask(): boolean {
    return !!this.taskDetails;
  }

  appendPenaltyDecision(item: PenaltyDecision): void {
    this.penaltyDecisions = [
      ...this.penaltyDecisions.filter(i => i.id !== item.id),
      item,
    ];
  }

  removePenaltyDecision(item: PenaltyDecision | undefined): void {
    if (!item) return;
    this.penaltyDecisions = [
      ...this.penaltyDecisions.filter(i => i.id !== item.id),
    ];
  }

  getPenaltyDecisionByOffenderId(
    offenderId: number,
  ): PenaltyDecision | undefined {
    return this.penaltyDecisions.find(i => i.offenderId === offenderId);
  }

  getPenaltyDecision(): PenaltyDecision[] {
    return this.penaltyDecisions || [];
  }

  getFirstPenaltyComment(penaltyKey: SystemPenalties): string {
    const decision = this.getPenaltyDecision().find(
      item => item.penaltyInfo.penaltyKey === penaltyKey,
    );
    return decision ? decision.comment! : '';
  }

  getFirstEmployeeComment(penaltyKey: SystemPenalties): string {
    const employeesIds = this.getEmployeesOffenders().map(item => item.id);
    const decision = this.getPenaltyDecision().find(item => {
      return (
        item.penaltyInfo.penaltyKey === penaltyKey &&
        employeesIds.includes(item.offenderId)
      );
    });
    return decision ? decision.comment! : '';
  }

  getFirstBrokerComment(penaltyKey: SystemPenalties): string {
    const brokersIds = this.getBrokersOffenders().map(item => item.id);
    const decision = this.getPenaltyDecision().find(item => {
      return (
        item.penaltyInfo.penaltyKey === penaltyKey &&
        brokersIds.includes(item.offenderId)
      );
    });
    return decision ? decision.comment! : '';
  }

  getEmployeesOffenders(): Offender[] {
    return this.offenderInfo.filter(
      item => item.type === OffenderTypes.EMPLOYEE,
    );
  }

  getBrokersOffenders(): Offender[] {
    return this.offenderInfo.filter(item => item.type === OffenderTypes.BROKER);
  }

  hasOffenders(): boolean {
    return this.offenderInfo && !!this.offenderInfo.length;
  }

  hasViolations(): boolean {
    return this.violationInfo && !!this.violationInfo.length;
  }

  hasValidOffenders(): boolean {
    const offendersIds = this.offenderInfo.map(i => i.id);
    return (
      this.hasOffenders() && // should have offenders
      this.hasViolations() && // should have Violations
      offendersIds.some(id => {
        // at least for each offender there is one linked
        return this.offenderViolationInfo.find(ov => ov.offenderId === id);
      })
    );
  }

  getOffenderViolationByOffender(offenderId: number): OffenderViolation[] {
    return this.offenderViolationInfo.filter(item => {
      return item.offenderId === offenderId;
    });
  }

  loadPenalties() {
    return this.getService().getCasePenalty(this.id, this.getActivityName()!);
  }

  getTaskId(): string | undefined {
    return this.taskDetails && this.taskDetails.tkiid;
  }

  hasUnlinkedViolations(): boolean {
    const relatedViolationsIds = this.offenderViolationInfo.map(
      i => i.violationId,
    );
    return this.violationInfo.some(v => !relatedViolationsIds.includes(v.id));
  }

  getUnlinkedViolations(): Violation[] {
    const relatedViolationsIds = this.offenderViolationInfo.map(
      i => i.violationId,
    );
    return this.violationInfo.filter(v => !relatedViolationsIds.includes(v.id));
  }

  hasEmployeesUnlinkedViolations(): boolean {
    return (
      this.hasUnlinkedViolations() &&
      this.getUnlinkedViolations().some(violation => {
        return violation.offenderTypeInfo.lookupKey === OffenderTypes.EMPLOYEE;
      })
    );
  }

  getEmployeesUnlinkedViolations(): Violation[] {
    return this.hasEmployeesUnlinkedViolations()
      ? this.getUnlinkedViolations().filter(item => {
          return item.offenderTypeInfo.lookupKey === OffenderTypes.EMPLOYEE;
        })
      : [];
  }

  getBrokersUnlinkedViolations(): Violation[] {
    return this.hasBrokersUnlinkedViolations()
      ? this.getUnlinkedViolations().filter(item => {
          return item.offenderTypeInfo.lookupKey === OffenderTypes.BROKER;
        })
      : [];
  }

  hasBrokersUnlinkedViolations(): boolean {
    return (
      this.hasUnlinkedViolations() &&
      this.getUnlinkedViolations().some(violation => {
        return violation.offenderTypeInfo.lookupKey === OffenderTypes.BROKER;
      })
    );
  }

  hasConcernedOffenders() {
    return !!(
      this.hasTask() &&
      this.taskDetails.activityProperties &&
      this.taskDetails.activityProperties.OffenderIds &&
      this.taskDetails.activityProperties.OffenderIds.value &&
      this.taskDetails.activityProperties.OffenderIds.value.items &&
      this.taskDetails.activityProperties.OffenderIds.value.items.length
    );
  }

  getConcernedOffendersIds(): number[] {
    return this.hasConcernedOffenders()
      ? this.taskDetails.activityProperties!.OffenderIds.value.items
      : [];
  }

  getConcernedOffenders(): Offender[] {
    const offendersIds = this.getConcernedOffendersIds();
    return this.offenderInfo.filter(offender =>
      offendersIds.includes(offender.id),
    );
  }

  /**
   * @description this method to return all concerned Offenders in the case even, but they should not have old Decisions
   * expect if you provide the penaltyKey if one of the offender has same decision return it no problem
   * @param penaltyKey
   */
  getConcernedOffendersWithOutOldDecision(
    penaltyKey?: SystemPenalties,
  ): Offender[] {
    const oldDecisions = this.penaltyDecisions.reduce<
      Record<number, PenaltyDecision>
    >((acc, penalty) => {
      return { ...acc, [penalty.offenderId]: penalty };
    }, {});
    const offendersHasDecisionsIds = Object.keys(oldDecisions).map(Number);
    return this.getConcernedOffenders().filter(offender => {
      return !penaltyKey
        ? !offendersHasDecisionsIds.includes(offender.id)
        : offendersHasDecisionsIds.includes(offender.id)
          ? oldDecisions[offender.id].penaltyInfo.penaltyKey === penaltyKey ||
            oldDecisions[offender.id].penaltyInfo.penaltyKey !==
              SystemPenalties.TERMINATE
          : true;
    });
  }

  getOffendersWithOldDecisions(penaltyKey?: SystemPenalties): Offender[] {
    const oldDecisions = this.penaltyDecisions.reduce<
      Record<number, PenaltyDecision>
    >((acc, penalty) => {
      return { ...acc, [penalty.offenderId]: penalty };
    }, {});
    const offendersHasDecisionsIds = Object.keys(oldDecisions).map(Number);
    return this.offenderInfo.filter(offender => {
      return !penaltyKey
        ? !offendersHasDecisionsIds.includes(offender.id)
        : offendersHasDecisionsIds.includes(offender.id)
          ? oldDecisions[offender.id].penaltyInfo.penaltyKey === penaltyKey ||
            oldDecisions[offender.id].penaltyInfo.penaltyKey !==
              SystemPenalties.TERMINATE
          : true;
    });
  }

  isOffenderConcerned(offenderId: number): boolean {
    return this.getConcernedOffendersIds().includes(offenderId);
  }

  shouldCheckProofStatus(
    offenderId: number,
    managerDecisionControl: ManagerDecisions | null,
  ): boolean {
    return [
      ManagerDecisions.GUIDANCE,
      ManagerDecisions.IT_IS_MANDATORY_TO_IMPOSE_A_PENALTY,
    ].includes(managerDecisionControl!) && this.isSubmitInvestigationActivity()
      ? this.getOffenderViolationByOffender(offenderId).some(item => {
          return item.proofStatus === ProofTypes.UNDEFINED;
        })
      : false;
  }

  itHasReferralRequestBefore(offenderId: number): boolean {
    const referrals = [
      SystemPenalties.REFERRAL_TO_PRESIDENT,
      SystemPenalties.REFERRAL_TO_PRESIDENT_ASSISTANT,
    ];
    return this.getPenaltyDecision().some(item => {
      return (
        referrals.includes(item.penaltyInfo.penaltyKey) &&
        item.offenderId !== offenderId
      );
    });
  }

  getOffendersHasSystemDecision(
    systemPenaltyKey: SystemPenalties,
    ignoreId?: number,
  ): Offender[] {
    const offendersIds = this.getPenaltyDecision()
      .filter(item => {
        return (
          systemPenaltyKey === item.penaltyInfo.penaltyKey &&
          (ignoreId ? ignoreId !== item.offenderId : true)
        );
      })
      .map(item => item.offenderId);
    return this.offenderInfo.filter(item => offendersIds.includes(item.id));
  }

  itIsSameReferralRequestType(
    systemPenaltyKey: SystemPenalties,
    offenderId: number,
  ): boolean {
    return this.getPenaltyDecision().some(
      item =>
        item.penaltyInfo.penaltyKey === systemPenaltyKey &&
        item.offenderId !== offenderId,
    );
  }

  private inActivity(activityName: ActivitiesName): boolean {
    return activityName === this.getActivityName();
  }

  isSubmitInvestigationActivity(): boolean {
    return this.inActivity(ActivitiesName.SUBMIT_INVESTIGATION);
  }

  inLegalAffairsActivity(): boolean {
    return this.inActivity(ActivitiesName.REVIEW_LEGAL_AFFAIRS);
  }
  inDisciplinaryCommittee(): boolean {
    return this.inActivity(ActivitiesName.REVIEW_DISCIPLINARY_COUNCIL);
  }
}
