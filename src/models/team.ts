import { BaseModel } from '@abstracts/base-model';
import { TeamService } from '@services/team.service';
import { TeamInterceptor } from '@model-interceptors/team-interceptor';
import { InterceptModel } from 'cast-response';
import { CustomValidators } from '@validators/custom-validators';

const { send, receive } = new TeamInterceptor();

@InterceptModel({ send, receive })
export class Team extends BaseModel<Team, TeamService> {
  $$__service_name__$$ = 'TeamService';
  ldapGroupName!: string;
  teamEmail!: string;
  customSettings!: string;
  autoClaim!: boolean;
  ouId!: number;
  authName!: string;
  parentDeptId!: number;

  // for disciplinary committee only
  secretary!: number;
  president!: number;

  buildForm(controls = false): object {
    const {
      ldapGroupName,
      arName,
      enName,
      teamEmail,
      autoClaim,
      parentDeptId,
      authName,
      secretary,
      president,
    } = this;
    return {
      ldapGroupName: ldapGroupName,
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
      teamEmail: [teamEmail, [CustomValidators.pattern('EMAIL')]],
      autoClaim: controls ? [autoClaim, CustomValidators.required] : autoClaim,
      parentDeptId: parentDeptId,
      authName: authName,
      secretary: controls ? [secretary] : secretary,
      president: controls ? [president] : president,
    };
  }
}
