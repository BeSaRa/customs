import { BaseModel } from '@abstracts/base-model';
import { SuspendedEmployeeService } from '@services/suspended-employee.service';
import { SuspendedEmployeeInterceptor } from '@model-interceptors/suspended-employee-interceptor';
import { InterceptModel } from 'cast-response';

const { send, receive } = new SuspendedEmployeeInterceptor();

@InterceptModel({ send, receive })
export class SuspendedEmployee extends BaseModel<SuspendedEmployee, SuspendedEmployeeService> {
  $$__service_name__$$ = 'SuspendedEmployeeService';

  buildForm(controls = false): object {
    return {};
  }
}
