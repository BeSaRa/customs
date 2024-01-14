import { BaseModel } from '@abstracts/base-model';
import { SuspendedEmployeeService } from '@services/suspended-employee.service';
import { SuspendedEmployeeInterceptor } from '@model-interceptors/suspended-employee-interceptor';
import { InterceptModel } from 'cast-response';
import { AdminResult } from './admin-result';

const { send, receive } = new SuspendedEmployeeInterceptor();

@InterceptModel({ send, receive })
export class SuspendedEmployee extends BaseModel<SuspendedEmployee, SuspendedEmployeeService> {
  $$__service_name__$$ = 'SuspendedEmployeeService';

  offenderId!: number;
  mawaredEmployee!: number;
  caseId!: string;
  serial!: string;
  decision!: string;
  decisionDate!: string;
  dateFrom!: string;
  dateTo!: string;
  duration!: number;
  type!: number;
  signerId!: number;
  typeInfo!: AdminResult;
  signerInfo!: AdminResult;
  signerName: string = this.signerInfo?.getNames();

  buildForm(controls = false): object {
    const {
      arName,
      enName,
      offenderId,
      mawaredEmployee,
      caseId,
      serial,
      decision,
      decisionDate,
      dateFrom,
      dateTo,
      duration,
      type,
      signerId,
      status,
    } = this;
    return {
      arName,
      enName,
      offenderId,
      mawaredEmployee,
      caseId,
      serial,
      decision,
      decisionDate,
      dateFrom,
      dateTo,
      duration,
      type,
      signerId,
      status,
    };
  }
}
