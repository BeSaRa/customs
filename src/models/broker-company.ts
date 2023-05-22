import { BaseModel } from '@abstracts/base-model';
import { BrokerCompanyService } from '@services/broker-company.service';
import { BrokerCompanyInterceptor } from '@model-interceptors/broker-company-interceptor';
import { InterceptModel } from 'cast-response';
import { CustomValidators } from '@validators/custom-validators';

const { send, receive } = new BrokerCompanyInterceptor();

@InterceptModel({ send, receive })
export class BrokerCompany extends BaseModel<BrokerCompany, BrokerCompanyService> {
  $$__service_name__$$ = 'BrokerCompanyService';

  licenseNumber!: string;
  code!: string;
  commercialRecord!: string;
  begingEstablished!: string;
  phoneNumber!: string;
  email!: string;
  address!: string;
  responsibleName!: string;
  bokerCompanyPenalties!: string;

  buildForm(controls = false): object {
    const {
      arName,
      enName,
      status,
      email,
      licenseNumber,
      code,
      commercialRecord,
      begingEstablished,
      phoneNumber,
      address,
      responsibleName,
      bokerCompanyPenalties,
    } = this;

    return {
      arName: controls ? [arName, [CustomValidators.maxLength(50), CustomValidators.pattern('AR_NUM')]] : arName,
      enName: controls ? [enName, [CustomValidators.required, CustomValidators.maxLength(50), CustomValidators.pattern('ENG_NUM')]] : enName,
      licenseNumber: controls ? [licenseNumber, [CustomValidators.required]] : licenseNumber,
      code: controls ? [code, [CustomValidators.required]] : code,
      commercialRecord: controls ? [commercialRecord, [CustomValidators.required]] : commercialRecord,
      begingEstablished: controls ? [begingEstablished, [CustomValidators.required]] : begingEstablished,
      phoneNumber: controls ? [phoneNumber, [CustomValidators.required]] : phoneNumber,
      email: controls ? [email, [CustomValidators.required, CustomValidators.pattern('EMAIL')]] : email,
      address: controls ? [address, [CustomValidators.required]] : address,
      responsibleName: controls ? [responsibleName, [CustomValidators.required]] : responsibleName,
      bokerCompanyPenalties: controls ? [bokerCompanyPenalties, [CustomValidators.required]] : bokerCompanyPenalties,

      status: controls ? [status ? status : 1, CustomValidators.required] : status ? status : 1,
    };
  }
}
