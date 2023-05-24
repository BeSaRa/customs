import { BaseModel } from '@abstracts/base-model';
import { MawaredDepartmentService } from '@services/mawared-department.service';
import { MawaredDepartmentInterceptor } from '@model-interceptors/mawared-department-interceptor';
import { InterceptModel } from 'cast-response';
import { CustomValidators } from '@validators/custom-validators';

const { send, receive } = new MawaredDepartmentInterceptor();

@InterceptModel({ send, receive })
export class MawaredDepartment extends BaseModel<
  MawaredDepartment,
  MawaredDepartmentService
> {
  $$__service_name__$$ = 'MawaredDepartmentService';

  ldapCode!: string;

  buildForm(controls = false): object {
    const { arName, enName, ldapCode, status } = this;
    return {
      arName: controls ? [arName, CustomValidators.required] : arName,
      enName: controls ? [enName, CustomValidators.required] : enName,
      status: controls ? [status, CustomValidators.required] : status,
      ldapCode: controls ? [ldapCode, CustomValidators.required] : ldapCode,
    };
  }
}
