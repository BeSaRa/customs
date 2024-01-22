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

const { send, receive } = new InvestigationInterceptor();

@InterceptModel({ send, receive })
export class Investigation extends BaseCase<
  InvestigationService,
  Investigation
> {
  $$__service_name__$$ = 'InvestigationService';
  override securityLevel = ViolationDegreeConfidentiality.LINITED_CIRCULATION;
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
  securityLevelInfo!: AdminResult;

  // TODO
  subject: string = '';

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
      createdOn: controls
        ? [{ value: createdOn, disabled: disabled }]
        : createdOn,
      description: controls
        ? [{ value: description, disabled: disabled }]
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
}
