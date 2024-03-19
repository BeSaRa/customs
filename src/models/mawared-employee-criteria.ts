import { MawaredEmployee } from '@models/mawared-employee';

export class MawaredEmployeeCriteria extends MawaredEmployee {
  constructor() {
    super();
  }

  override buildForm(controls = false): object {
    const {
      arName,
      enName,
      qid,
      employeeDepartmentId,
      jobTitleCode,
      employeeCareerLevelId,
      employeeQualificationId,
    } = this;
    return {
      arName: controls ? [arName] : arName,
      enName: controls ? [enName] : enName,
      qid: controls ? [qid] : qid,
      employeeDepartmentId: controls
        ? [employeeDepartmentId]
        : employeeDepartmentId,
      jobTitleCode: controls ? [jobTitleCode] : jobTitleCode,
      employeeCareerLevelId: controls
        ? [employeeCareerLevelId]
        : employeeCareerLevelId,
      employeeQualificationId: controls
        ? [employeeQualificationId]
        : employeeQualificationId,
    };
  }
}
