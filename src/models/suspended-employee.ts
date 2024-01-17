import { BaseModel } from '@abstracts/base-model';
import { SuspendedEmployeeService } from '@services/suspended-employee.service';
import { SuspendedEmployeeInterceptor } from '@model-interceptors/suspended-employee-interceptor';
import { InterceptModel } from 'cast-response';
import { AdminResult } from './admin-result';
import { MawaredEmployee } from './mawared-employee';

const { send, receive } = new SuspendedEmployeeInterceptor();

@InterceptModel({ send, receive })
export class SuspendedEmployee extends BaseModel<
  SuspendedEmployee,
  SuspendedEmployeeService
> {
  $$__service_name__$$ = 'SuspendedEmployeeService';

  offenderId!: number;
  mawaredEmployeeId!: number;
  caseId!: string;
  serial!: string;
  decision!: string;
  decisionDate!: string;
  dateFrom!: string;
  dateTo!: string;
  duration!: number; //TODO in hours. It should be transformed to ...?
  type!: number;
  signerId!: number;
  typeInfo!: AdminResult;
  mawaredEmployeeIdInfo!: MawaredEmployee;
  signerInfo!: AdminResult;
  signerName: string = this.signerInfo?.getNames();

  buildForm(): object {
    const { arName, enName, dateFrom, dateTo, status } = this;
    return {
      arName,
      enName,
      dateFrom,
      dateTo,
      status,
    };
  }
}
