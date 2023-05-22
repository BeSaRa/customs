import { BaseModel } from '@abstracts/base-model';
import { MawaredEmployeeInterceptor } from '@model-interceptors/mawared-employee-interceptor';
import { MawaredEmployeeService } from '@services/mawared-employee.service';
import { InterceptModel } from 'cast-response';

const { send, receive } = new MawaredEmployeeInterceptor();

@InterceptModel({ send, receive })
export class MawaredEmployee extends BaseModel<
  MawaredEmployee,
  MawaredEmployeeService
> {
  $$__service_name__$$ = 'MawaredEmployeeService';
  username!: string;
  email!: string;
  anotherEmail!: string;
  phone!: string;
  anotherPhone!: string;
  adName!: string;
  employeeDepartmentId!: number;
  isDepMailManager!: boolean;
  subDepartmentId!: number;
  subDepartmentName!: string;
  gender!: string;
  employeeCareerLevelId!: number;
  employeeCareerLevel!: string;
  employeeQualificationId!: number;
  employeeQualification!: string;
  gradDate!: string;
  totalAbsent!: number;
  totalSickLeave!: number;
  employeeQId!: string;
  employeeNumberOfPenalties!: number;
  employeeLastPenalties!: string;
  employeeLastRatingScore!: string;
  totalExams!: number;
  totalThanksBooks!: number;
  gethDate!: string;

  buildForm(controls = false): object {
    const { arName, enName } = this;
    return {
      arName: arName,
      enName: enName,
    };
  }
}
