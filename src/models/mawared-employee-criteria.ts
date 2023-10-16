import { MawaredEmployee } from '@models/mawared-employee';

export class MawaredEmployeeCriteria extends MawaredEmployee {
  constructor() {
    super();
  }

  override buildForm(controls = false): object {
    const { arName, enName, qid, employeeDepartmentId } = this;
    return {
      arName: controls ? [arName] : arName,
      enName: controls ? [enName] : enName,
      qid: controls ? [qid] : qid,
      employeeDepartmentId: controls ? [{ value: employeeDepartmentId, disabled: true }] : employeeDepartmentId,
    };
  }
}
