import { AdminResult } from '@models/admin-result';
import { BaseModel } from '@abstracts/base-model';
import { ViolationService } from '@services/violation.service';
import { ViolationInterceptor } from '@model-interceptors/violation-interceptor';
import { InterceptModel } from 'cast-response';

const { send, receive } = new ViolationInterceptor();

@InterceptModel({ send, receive })
export class Violation extends BaseModel<Violation, ViolationService> {
  $$__service_name__$$ = 'ViolationService';
  caseId!: string;
  violationTypeId!: number;
  violationsDate!: string | Date;
  violationsDateFrom!: string | Date;
  violationsDateTo!: string | Date;
  reportNumber!: string;
  reportYear!: string;
  description!: string;
  forensicLabAnalysis!: number;
  securityAdminDecision!: number;
  drugProsecutionDecision!: number;
  courtDecision!: number;
  competentProsecutionDecision!: number;
  statusDateModified!: string | Date;
  violationTypeInfo!: AdminResult;
  forensicLabAnalysisInfo!: AdminResult;
  securityAdminDecisionInfo!: AdminResult;
  drugProsecutionDecisionInfo!: AdminResult;
  courtDecisionInfo!: AdminResult;
  competentProsecutionDecisionInfo!: AdminResult;
  violationClassification!: number;
  violationClassificationInfo!: AdminResult;
  customsDeclarationNumber!: string;
  controlReportNumber!: string;

  // temp properties
  violationClassificationId!: number;

  buildForm(controls = false): object {
    const {
      violationTypeId,
      reportYear,
      reportNumber,
      violationClassification,
      violationsDate,
      violationsDateFrom,
      violationsDateTo,
      arName,
      enName,
      securityAdminDecision,
      description,
      customsDeclarationNumber,
      controlReportNumber,
    } = this;
    return {
      violationTypeId: controls ? [violationTypeId] : violationTypeId,
      violationClassificationId: controls ? [violationClassification] : violationClassification,
      violationsDate: controls ? [violationsDate] : violationsDate,
      violationsDateFrom: controls ? [violationsDateFrom] : violationsDateFrom,
      violationsDateTo: controls ? [violationsDateTo] : violationsDateTo,
      arName: controls ? [arName] : arName,
      enName: controls ? [enName] : enName,
      reportNumber: controls ? [reportNumber] : reportNumber,
      reportYear: controls ? [reportYear] : reportYear,
      securityAdminDecision: controls ? [securityAdminDecision] : securityAdminDecision,
      description: controls ? [description] : description,
      customsDeclarationNumber: controls ? [customsDeclarationNumber] : customsDeclarationNumber,
      controlReportNumber: controls ? [controlReportNumber] : controlReportNumber,
    };
  }
}