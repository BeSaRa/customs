import { BaseModel } from '@abstracts/base-model';
import { MawaredEmployeeService } from '@services/mawared-employee.service';
import { MawaredEmployeeInterceptor } from '@model-interceptors/mawared-employee-interceptor';
import { InterceptModel } from 'cast-response';

const { send, receive } = new MawaredEmployeeInterceptor();

@InterceptModel({ send, receive })
export class MawaredEmployee extends BaseModel<
  MawaredEmployee,
  MawaredEmployeeService
> {
  $$__service_name__$$ = 'MawaredEmployeeService';

  buildForm(controls = false): object {
    return {};
  }
}
