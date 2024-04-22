import { BaseModel } from '@abstracts/base-model';
import { ClearingAgencyService } from '@services/clearing-agency.service';
import { ClearingAgencyInterceptor } from '@model-interceptors/clearing-agency-interceptor';
import { InterceptModel } from 'cast-response';

const { send, receive } = new ClearingAgencyInterceptor();

@InterceptModel({ send, receive })
export class ClearingAgency extends BaseModel<
  ClearingAgency,
  ClearingAgencyService
> {
  $$__service_name__$$ = 'ClearingAgencyService';

  agencyId!: number;
  arabicCompanyName!: string;
  englishCompanyName!: string;
  licenseNo!: string;
  customCode!: string;
  crNo!: string;
  establishmentId!: string;
  telNo!: string;
  email!: string;
  address!: string;
  accountAdminFullName!: string;
  licenseIssueDate!: string;
  licenseExpiryDate!: string;
  previousLicenseFeePenalty!: number;

  buildForm(): object {
    const {
      enName,
      arName,
      status,
      email,
      licenseNo,
      customCode,
      crNo,
      telNo,
      address,
      accountAdminFullName,
      licenseIssueDate,
      licenseExpiryDate,
      establishmentId,
    } = this;
    return {
      enName,
      arName,
      status,
      email,
      licenseNo,
      customCode,
      crNo,
      telNo,
      address,
      accountAdminFullName,
      licenseIssueDate,
      licenseExpiryDate,
      establishmentId,
    };
  }

  getStatusInfoName() {
    return this.statusInfo?.getNames() || '';
  }
}
