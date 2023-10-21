import { BaseModel } from '@abstracts/base-model';
import { BrokerService } from '@services/broker.service';
import { BrokerInterceptor } from '@model-interceptors/broker-interceptor';
import { InterceptModel } from 'cast-response';
import { AdminResult } from './admin-result';
import { CustomValidators } from '@validators/custom-validators';
import { Offender } from '@models/offender';
import { OffenderTypes } from '@enums/offender-types';

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

  buildForm(): object {
    const { arName, enName, status, licenseNumber, licenseStartDate, licenseEndDate, phoneNumber, email, bokerPenalties, code, qid, companyId } =
      this;
    return {
      arName,
      enName,
      status,
      licenseNumber,
      licenseStartDate,
      licenseEndDate,
      phoneNumber,
      email,
      bokerPenalties,
      code,
      qid,
      companyId,
      statusInfo: this.getStatusInfoName(),
    };
  }

  getStatusInfoName() {
    return this.statusInfo.getNames();
  }

  convertToOffender(caseId: string) {
    return new Offender().clone<Offender>({
      type: OffenderTypes.BROKER,
      caseId: caseId,
      arName: this.arName,
      enName: this.enName,
      status: 1,
      offenderRefId: this.id,
    });
  }
}
