import { BaseModel } from '@abstracts/base-model';
import { MawaredEmployeeInterceptor } from '@model-interceptors/mawared-employee-interceptor';
import { MawaredEmployeeService } from '@services/mawared-employee.service';
import { InterceptModel } from 'cast-response';
import { Offender } from '@models/offender';
import { OffenderTypes } from '@enums/offender-types';

const { send, receive } = new MawaredEmployeeInterceptor();

@InterceptModel({ send, receive })
export class MawaredEmployee extends BaseModel<MawaredEmployee, MawaredEmployeeService> {
  $$__service_name__$$ = 'MawaredEmployeeService';
  username!: string;
  email!: string;
  anotherEmail!: string;
  phone!: string;
  anotherPhone!: string;
  qid!: string;
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
  employeeNumberOfPenalties!: number;
  employeeLastPenalties!: string;
  employeeLastRatingScore!: string;
  totalExams!: number;
  totalThanksBooks!: number;
  gethDate!: string;

  buildForm(): object {
    const {
      arName,
      enName,
      username,
      email,
      anotherEmail,
      phone,
      anotherPhone,
      qid,
      gender,
      subDepartmentName,
      employeeCareerLevel,
      employeeQualification,
      gradDate,
      totalAbsent,
      totalSickLeave,
      employeeNumberOfPenalties,
      employeeLastPenalties,
      totalExams,
      totalThanksBooks,
    } = this;
    return {
      arName,
      enName,
      username,
      email,
      anotherEmail,
      phone,
      anotherPhone,
      qid,
      gender,
      subDepartmentName,
      employeeCareerLevel,
      employeeQualification,
      gradDate,
      totalAbsent,
      totalSickLeave,
      employeeNumberOfPenalties,
      employeeLastPenalties,
      totalExams,
      totalThanksBooks,
      statusInfo: this.getStatusInfoName(),
    };
  }

  getStatusInfoName() {
    return this.statusInfo.getNames() || '';
  }

  convertToOffender(caseId: string): Offender {
    return new Offender().clone<Offender>({
      caseId: caseId,
      enName: this.arName,
      arName: this.arName,
      type: OffenderTypes.EMPLOYEE,
      offenderRefId: this.id,
      status: 1,
    });
  }
}
