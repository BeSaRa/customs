import { BaseModel } from '@abstracts/base-model';
import { AssignmentToAttendService } from '@services/assignment-to-attend.service';
import { CustomValidators } from '@validators/custom-validators';

export class AssignmentToAttend extends BaseModel<
  AssignmentToAttend,
  AssignmentToAttendService
> {
  override $$__service_name__$$: string = 'AssignmentToAttendService';
  caseId!: string;
  summonedId!: number;
  type!: number;
  summonedType!: number;
  note!: string;
  buildForm(): object {
    return {
      caseId: [null, [CustomValidators.required]],
      summonedId: [null, [CustomValidators.required]],
      type: [null, [CustomValidators.required]],
      summonedType: [null, CustomValidators.required],
      note: [null],
      enName: [null],
      arName: [null],
    };
  }
}
