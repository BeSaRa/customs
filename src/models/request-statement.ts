import { ClonerMixin } from '@mixins/cloner-mixin';
import { CustomValidators } from '@validators/custom-validators';

export class RequestStatement extends ClonerMixin(class {}) {
  caseId!: string;
  description!: string;
  approve!: boolean;
  departments!: number[];
  buildForm(): object {
    const { caseId, description, approve, departments } = this;
    return {
      caseId: [caseId, [CustomValidators.required]],
      description: [description, [CustomValidators.required]],
      approve: [approve],
      departments: [departments, [CustomValidators.required]],
    };
  }
}
