import { BaseModel } from '@abstracts/base-model';
import { MawaredDepartmentService } from '@services/mawared-department.service';
import { MawaredDepartmentInterceptor } from '@model-interceptors/mawared-department-interceptor';
import { InterceptModel } from 'cast-response';
import { AdminResult } from './admin-result';

const { send, receive } = new MawaredDepartmentInterceptor();

@InterceptModel({ send, receive })
export class MawaredDepartment extends BaseModel<
  MawaredDepartment,
  MawaredDepartmentService
> {
  $$__service_name__$$ = 'MawaredDepartmentService';

  ldapCode!: string;
  departmentId!: number;
  parentId!: number;
  parentInfo!: AdminResult;

  buildForm(): object {
    const { arName, enName, ldapCode, status } = this;
    return {
      arName,
      enName,
      ldapCode,
      status,
      statusInfo: this.getStatusInfoName(),
      parentInfo: this.getParentDepartmentInfoName(),
    };
  }

  getStatusInfoName() {
    return this.statusInfo?.getNames() || '';
  }

  getParentDepartmentInfoName() {
    return this.parentInfo?.getNames() || '';
  }
}
