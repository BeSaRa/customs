import { BaseModel } from '@abstracts/base-model';
import { BrokerService } from '@services/broker.service';
import { BrokerInterceptor } from '@model-interceptors/broker-interceptor';
import { InterceptModel } from 'cast-response';
import { AdminResult } from './admin-result';
import { CustomValidators } from '@validators/custom-validators';

const { send, receive } = new BrokerInterceptor();

@InterceptModel({ send, receive })
export class Broker extends BaseModel<Broker, BrokerService> {
  $$__service_name__$$ = 'BrokerService';

  qid!: string;
  code!: string;
  licenseNumber!: string;
  licenseStartDate!: string;
  licenseEndDate!: string;
  phoneNumber!: string;
  email!: string;
  bokerPenalties!: string;
  companyInfo!: AdminResult;
  companyId!: number;

  buildForm(controls = false): object {
    const { arName, enName, status, licenseNumber, licenseStartDate, licenseEndDate, phoneNumber, email, bokerPenalties, code, qid, companyId } =
      this;
    return {
      arName: controls ? [arName, CustomValidators.required] : arName,
      enName: controls ? [enName, CustomValidators.required] : enName,
      status: controls ? [status, CustomValidators.required] : status,
      licenseNumber: controls ? [licenseNumber, CustomValidators.required] : licenseNumber,
      licenseStartDate: controls ? [licenseStartDate, CustomValidators.required] : licenseStartDate,
      licenseEndDate: controls ? [licenseEndDate, CustomValidators.required] : licenseEndDate,
      phoneNumber: controls ? [phoneNumber, CustomValidators.required] : phoneNumber,
      email: controls ? [email, CustomValidators.required] : email,
      bokerPenalties: controls ? [bokerPenalties, CustomValidators.required] : bokerPenalties,
      code: controls ? [code, CustomValidators.required] : code,
      qid: controls ? [qid, CustomValidators.required] : qid,
      companyId: controls ? [companyId, CustomValidators.required] : companyId,
    };
  }
}
