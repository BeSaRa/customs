import { BaseModel } from '@abstracts/base-model';
import { MawaredDepartmentService } from '@services/mawared-department.service';
import { MawaredDepartmentInterceptor } from '@model-interceptors/mawared-department-interceptor';
import { InterceptModel } from 'cast-response';

const { send, receive } = new MawaredDepartmentInterceptor();

@InterceptModel({ send, receive })
export class MawaredDepartment extends BaseModel<MawaredDepartment, MawaredDepartmentService> {
  $$__service_name__$$ = 'MawaredDepartmentService';

  ldapCode!: string;

  buildForm(): object {
    const { arName, enName, ldapCode, status } = this;
    return {
      arName,
      enName,
      ldapCode,
      status,
      statusInfo: this.getStatusInfoName(),
    };
  }

  getStatusInfoName() {
    return this.statusInfo.getNames();
  }
}
