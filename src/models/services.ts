import { BaseModel } from '@abstracts/base-model';
import { ServicesService } from '@services/services.service';
import { ServicesInterceptor } from '@model-interceptors/services-interceptor';
import { InterceptModel } from 'cast-response';
import { AdminResult } from './admin-result';
import { CustomValidators } from '@validators/custom-validators';

const { send, receive } = new ServicesInterceptor();

@InterceptModel({ send, receive })
export class Services extends BaseModel<Services, ServicesService> {
  $$__service_name__$$ = 'ServicesService';

  caseType!: number;
  serviceTimeLimit!: number;
  licenseMinTime!: number;
  licenseMaxTime!: number;
  fees!: number;
  bawServiceCode!: string;
  requestSerialCode!: string;
  licenseSerialCode!: string;
  serviceDescription!: string;
  serviceRequirements!: string;
  serviceTerms!: string;
  serviceStepsArabic!: string;
  serviceStepsEnglish!: string;
  statusDateModified!: string;
  customSettings!: string;
  getsLA!: number;
  serviceReviewLimit!: number;
  followUp!: boolean;
  followUpDateModified!: string;

  // extras
  updatedOnString!: string;
  updatedByInfo!: AdminResult;

  buildForm(controls = false): object {
    const {
      arName,
      enName,
      bawServiceCode,
      status,
      licenseSerialCode,
      requestSerialCode,
      caseType,
      serviceTimeLimit,
      licenseMinTime,
      licenseMaxTime,
      fees,
      serviceDescription,
      serviceRequirements,
      serviceTerms,
      serviceStepsArabic,
      serviceStepsEnglish,
    } = this;
    return {
      arName: controls ? [arName, [CustomValidators.required, CustomValidators.maxLength(50), CustomValidators.pattern('AR_NUM')]] : arName,
      enName: controls ? [enName, [CustomValidators.required, CustomValidators.maxLength(50), CustomValidators.pattern('ENG_NUM')]] : enName,
      status: controls ? [status, CustomValidators.required] : status,
      caseType: controls ? [caseType, CustomValidators.required] : caseType,
      bawServiceCode: controls ? [bawServiceCode, CustomValidators.required] : bawServiceCode,
      licenseSerialCode: controls ? [licenseSerialCode, CustomValidators.required] : licenseSerialCode,
      requestSerialCode: controls ? [requestSerialCode, CustomValidators.required] : requestSerialCode,
      serviceTimeLimit: controls ? [serviceTimeLimit, CustomValidators.number] : serviceTimeLimit,
      licenseMinTime: controls ? [licenseMinTime, CustomValidators.number] : licenseMinTime,
      licenseMaxTime: controls ? [licenseMaxTime, CustomValidators.number] : licenseMaxTime,
      fees: controls ? [fees, CustomValidators.number] : fees,
      serviceTerms: controls ? [serviceTerms] : serviceTerms,
      serviceRequirements: controls ? [serviceRequirements] : serviceRequirements,
      serviceDescription: controls ? [serviceDescription] : serviceDescription,
      serviceStepsArabic: controls ? [serviceStepsArabic] : serviceStepsArabic,
      serviceStepsEnglish: controls ? [serviceStepsEnglish] : serviceStepsEnglish,
    };
  }
}
