import { BaseModel } from '@abstracts/base-model';
import { BrokerCompanyService } from '@services/broker-company.service';
import { BrokerCompanyInterceptor } from '@model-interceptors/broker-company-interceptor';
import { InterceptModel } from 'cast-response';

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
  licenseStartDate!: string;
  licenseEndDate!: string;

  buildForm(): object {
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
      licenseStartDate,
      licenseEndDate,
    } = this;

    return {
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
      licenseStartDate,
      licenseEndDate,
    };
  }
}
