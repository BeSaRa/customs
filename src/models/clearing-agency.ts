import { BaseModel } from '@abstracts/base-model';
import { ClearingAgencyService } from '@services/clearing-agency.service';
import { ClearingAgencyInterceptor } from '@model-interceptors/clearing-agency-interceptor';
import { InterceptModel } from 'cast-response';
import { CustomValidators } from '@validators/custom-validators';

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

  buildForm(controls = false): object {
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
    } = this;
    return {
      enName: controls ? [enName, CustomValidators.required] : enName,
      arName: controls ? [arName, CustomValidators.required] : arName,
      status: controls ? [status, CustomValidators.required] : status,
      email: controls ? [email, CustomValidators.required] : email,
      licenseNo: controls ? [licenseNo, CustomValidators.required] : licenseNo,
      customCode: controls
        ? [customCode, CustomValidators.required]
        : customCode,
      crNo: controls ? [crNo, CustomValidators.required] : crNo,
      telNo: controls ? [telNo, CustomValidators.required] : telNo,
      address: controls ? [address, CustomValidators.required] : address,
      accountAdminFullName: controls
        ? [accountAdminFullName, CustomValidators.required]
        : accountAdminFullName,
      licenseIssueDate: controls
        ? [licenseIssueDate, CustomValidators.required]
        : licenseIssueDate,
      licenseExpiryDate: controls
        ? [licenseExpiryDate, CustomValidators.required]
        : licenseExpiryDate,
    };
  }

  getStatusInfoName() {
    return this.statusInfo.getNames();
  }
}
