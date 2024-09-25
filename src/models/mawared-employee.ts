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
  email!: string;
  qid!: string;
  employeeDepartmentId!: number;
  employeeDepartmentInfo!: AdminResult;
  gender!: string;
  employeeCareerLevelId!: number;
  employeeCareerLevelInfo!: AdminResult;
  gethDate!: string;
  address!: string;
  type!: number;
  phoneNumber!: string;
  typeInfo!: AdminResult;
  employeeNo!: number;
  isPrivateUser!: boolean;
  arNationality!: string;
  enNationality!: string;
  city!: string;
  country!: string;
  postal!: string;
  arCertificate!: string;
  enCertificate!: string;
  employeeSectionId!: string;
  employeeSectionInfo!: AdminResult;
  arPosition!: string;
  enPosition!: string;
  arJobDescription!: string;
  enJobDescription!: string;
  isSuspended!: boolean;
  appointmentStartDate!: string;
  appointmentEndDate!: string;
  terminationServiceReason!: string;
  // not related to the model
  code?: string;
  jobTitleCode?: string;

  buildForm(): object {
    const {
      arName,
      enName,
      email,
      qid,
      gender,
      isPrivateUser,
      gethDate,
      arNationality,
      enNationality,
      city,
      country,
      jobTitleCode,
      postal,
      arCertificate,
      enCertificate,
      arPosition,
      enPosition,
      arJobDescription,
      enJobDescription,
      isSuspended,
      phoneNumber,
      employeeNo,
      employeeCareerLevelId,
    } = this;
    return {
      arName,
      enName,
      email,
      qid,
      gender,
      jobTitleCode,
      employeeDepartmentInfo: this.getEmployeeDepartmentInfoName(),
      isPrivateUser,
      statusInfo: this.getStatusInfoName(), //
      employeeCareerLevelInfo: this.getEmployeeCareerLevelInfoName(), //
      employeeSectionInfo: this.getEmployeeSectionInfoName(), //
      gethDate,
      arNationality,
      enNationality,
      city,
      country,
      postal,
      arCertificate,
      enCertificate,
      arPosition,
      enPosition,
      arJobDescription,
      enJobDescription,
      isSuspended,
      phoneNumber,
      employeeNo,
      employeeCareerLevelId,
    };
  }

  getStatusInfoName() {
    return this.statusInfo?.getNames() || '';
  }

  getEmployeeCareerLevelInfoName() {
    return this.employeeCareerLevelInfo?.getNames() || '';
  }

  getEmployeeSectionInfoName() {
    return this.employeeSectionInfo?.getNames() || '';
  }

  getEmployeeDepartmentInfoName() {
    return this.employeeDepartmentInfo?.getNames() || '';
  }

  convertToOffender(caseId: string): Offender {
    return new Offender().clone<Offender>({
      caseId: caseId,
      enName: this.enName,
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
      enName: this.enName,
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
