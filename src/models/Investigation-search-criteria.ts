import { Investigation } from './investigation';
import { CustomValidators } from '@validators/custom-validators';
import { OffenderTypeWithNone } from '@enums/offender-type-with-none';

export class InvestigationSearchCriteria extends Investigation {
  override $$__service_name__$$: string = 'InvestigationSearchCriteria';

  mawaredEmployeeId!: number;
  clearingAgentId!: number;
  createdFrom!: string;
  createdTo!: string;
  draftNumber!: string;
  decisionNumber!: string;
  departmentId!: number;
  penaltyId!: number;
  violationTypeId!: number;
  offenderType: number = OffenderTypeWithNone.ALL;
  investigationFileNumber!: string;

  override buildForm(
    controls: boolean = false,
    disabled: boolean = false,
  ): object {
    const {
      departmentId,
      penaltyId,
      description,
      violationTypeId,
      offenderType,
      caseStatus,
      mawaredEmployeeId,
      clearingAgentId,
      securityLevel,
      createdFrom,
      createdTo,
      draftNumber,
      decisionNumber,
      investigationFileNumber,
    } = this;
    return {
      description: controls
        ? [
            { value: description, disabled: disabled },
            [CustomValidators.maxLength(100000)],
          ]
        : description,
      mawaredEmployeeId: controls ? [mawaredEmployeeId] : mawaredEmployeeId,
      clearingAgentId: controls ? [clearingAgentId] : clearingAgentId,
      securityLevel: controls
        ? [securityLevel, CustomValidators.required]
        : securityLevel,
      createdFrom: controls ? [createdFrom] : createdFrom,
      createdTo: controls ? [createdTo] : createdTo,
      draftNumber: controls ? [draftNumber] : draftNumber,
      decisionNumber: controls ? [decisionNumber] : decisionNumber,
      departmentId: controls
        ? [departmentId, CustomValidators.required]
        : departmentId,
      penaltyId: controls ? [penaltyId] : penaltyId,
      violationTypeId: controls ? [violationTypeId] : violationTypeId,
      investigationFileNumber: controls
        ? [investigationFileNumber]
        : investigationFileNumber,
      offenderType: controls
        ? [offenderType, CustomValidators.required]
        : offenderType,
      caseStatus: controls ? [caseStatus] : caseStatus,
    };
  }
}
