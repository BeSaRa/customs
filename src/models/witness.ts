import { BaseModel } from '@abstracts/base-model';
import { WitnessService } from '@services/witness.service';
import { CustomValidators } from '@validators/custom-validators';
import { AdminResult } from './admin-result';

export class Witness extends BaseModel<Witness, WitnessService> {
  $$__service_name__$$ = 'WitnessService';
  caseId!: string;

  witnessRefId!: number;
  witnessType!: number;
  personType!: number;

  phoneNumber!: string;
  email!: string;

  witnessInfo!: AdminResult;
  witnessTypeInfo!: AdminResult;
  personTypeInfo!: AdminResult;

  statusDateModified?: Date | string;

  buildForm(controls = false): object {
    const { arName, enName } = this;
    return {
      arName: controls
        ? [
            arName,
            [
              CustomValidators.required,
              CustomValidators.maxLength(50),
              CustomValidators.pattern('AR_NUM'),
            ],
          ]
        : arName,
      enName: controls
        ? [
            enName,
            [
              CustomValidators.required,
              CustomValidators.maxLength(50),
              CustomValidators.pattern('ENG_NUM'),
            ],
          ]
        : enName,
      phoneNumber: controls ? [enName] : enName,
      email: controls ? [enName] : enName,
    };
  }
}
