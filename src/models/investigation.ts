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
import { EmployeeService } from '@services/employee.service';
import { ServiceRegistry } from '@services/service-registry';

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
  securityLevelInfo?: AdminResult;
  isDrafted!: boolean;
  subject!: string;
  $$__employeeService__$$ = 'EmployeeService';

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
            { value: securityLevel, disabled: disabled },
            CustomValidators.required,
          ]
        : securityLevel,
      subject: controls
        ? [
            subject,
            [CustomValidators.required, CustomValidators.maxLength(1024)],
          ]
        : subject,
    };
  }

  getActivityName(): string | undefined {
    return (
      this.taskDetails &&
      this.taskDetails.processInstanceName &&
      this.taskDetails.processInstanceName.split(':')[0]
    );
  }

  hasTask(): boolean {
    return !!this.taskDetails;
  }

  appendPenaltyDecision(item: PenaltyDecision): void {
    this.taskDetails.penaltyDecisions = [
      ...this.taskDetails.penaltyDecisions.filter(i => i.id !== item.id),
      item,
    ];
  }

  removePenaltyDecision(item: PenaltyDecision): void {
    this.taskDetails.penaltyDecisions = [
      ...this.taskDetails.penaltyDecisions.filter(i => i.id !== item.id),
    ];
  }

  getPenaltyDecisionByOffenderId(
    offenderId: number,
  ): PenaltyDecision | undefined {
    console.log('PP', this.taskDetails.penaltyDecisions);
    return this.taskDetails.penaltyDecisions.find(
      i => i.offenderId === offenderId,
    );
  }

  getPenaltyDecision(): PenaltyDecision[] {
    return this.taskDetails.penaltyDecisions;
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
}
