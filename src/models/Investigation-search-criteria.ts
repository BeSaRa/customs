import { Investigation } from './investigation';
import { OffenderTypeWithNone } from '@enums/offender-type-with-none';

export class InvestigationSearchCriteria extends Investigation {
  override $$__service_name__$$: string = 'InvestigationSearchCriteria';

  offenderType: number = OffenderTypeWithNone.ALL;
  name!: string;
  qId!: string;
  eId!: string;
  employeeNo!: string;
  customCode!: string;
  investigationFileNumber!: string;
  createdFrom!: string;
  createdTo!: string;
  year!: number;
  generalStatus!: number;
  executionStatus!: number;
  violationClassificationId!: number;
  reportNumber!: string;
  customsDeclarationNumber!: string;
  controlReportNumber!: string;
  departmentId!: number;

  override buildForm(controls: boolean = false): object {
    const {
      name,
      qId,
      eId,
      employeeNo,
      customCode,
      departmentId,
      offenderType,
      year,
      generalStatus,
      executionStatus,
      violationClassificationId,
      reportNumber,
      customsDeclarationNumber,
      controlReportNumber,
      createdFrom,
      createdTo,
      investigationFileNumber,
    } = this;
    return {
      name: controls ? [name] : name,
      qId: controls ? [qId] : qId,
      eId: controls ? [eId] : eId,
      employeeNo: controls ? [employeeNo] : employeeNo,
      customCode: controls ? [customCode] : customCode,
      year: controls ? [year] : year,
      generalStatus: controls ? [generalStatus] : generalStatus,
      executionStatus: controls ? [executionStatus] : executionStatus,
      violationClassificationId: controls
        ? [violationClassificationId]
        : violationClassificationId,
      reportNumber: controls ? [reportNumber] : reportNumber,
      customsDeclarationNumber: controls
        ? [customsDeclarationNumber]
        : customsDeclarationNumber,
      controlReportNumber: controls
        ? [controlReportNumber]
        : controlReportNumber,
      createdFrom: controls ? [createdFrom] : createdFrom,
      createdTo: controls ? [createdTo] : createdTo,
      departmentId: controls ? [departmentId] : departmentId,
      investigationFileNumber: controls
        ? [investigationFileNumber]
        : investigationFileNumber,
      offenderType: controls ? [offenderType] : offenderType,
    };
  }
}
