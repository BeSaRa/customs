import { BaseModel } from '@abstracts/base-model';
import { MawaredEmployeeInterceptor } from '@model-interceptors/mawared-employee-interceptor';
import { MawaredEmployeeService } from '@services/mawared-employee.service';
import { InterceptModel } from 'cast-response';
import { Offender } from '@models/offender';
import { OffenderTypes } from '@enums/offender-types';
import { WitnessTypes } from '@enums/witness-types';
import { Witness } from '@models/witness';
import { AdminResult } from './admin-result';

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
  qid!: string;
  adName!: string;
  employeeDepartmentId!: number;
  employeeDepartmentInfo!: AdminResult;
  isDepMailManager!: boolean;
  subDepartmentId!: number;
  subDepartmentName!: string;
  gender!: string;
  employeeCareerLevelId!: number;
  employeeCareerLevelInfo!: AdminResult;
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
  address!: string;
  type!: number;
  phoneNumber!: string;
  jobTitleCode?: string;
  typeInfo!: AdminResult;

  // not related to the model
  code?: string;

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
    return this.statusInfo?.getNames() || '';
  }

  convertToOffender(caseId: string): Offender {
    return new Offender().clone<Offender>({
      caseId: caseId,
      enName: this.arName,
      arName: this.arName,
      type: OffenderTypes.EMPLOYEE,
      offenderRefId: this.id,
      status: 1,
      ouId: this.employeeDepartmentId,
    });
  }

  convertToWitness(caseId: string, personType: number): Witness {
    return new Witness().clone<Witness>({
      personType,
      caseId: caseId,
      enName: this.arName,
      arName: this.arName,
      witnessType: WitnessTypes.EMPLOYEE,
      witnessRefId: this.id,
      status: 1,
    });
  }

  static createInstance(model: Partial<MawaredEmployee>): MawaredEmployee {
    return Object.assign(new MawaredEmployee(), model);
  }

  isEmployee(): boolean {
    return true;
  }

  isAgent(): boolean {
    return false;
  }
}
