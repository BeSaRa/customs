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
  autoClaim!: boolean;

  buildForm(controls = false): object {
    const { ldapGroupName, arName, enName, autoClaim } = this;
    return {
      ldapGroupName: ldapGroupName,
      arName: controls
        ? [
            arName,
            CustomValidators.required,
            // CustomValidators.pattern('AR_ONLY'),
          ]
        : arName,
      enName: controls
        ? [
            enName,
            CustomValidators.required,
            // CustomValidators.pattern('ENG_ONLY'),
          ]
        : enName,
      autoClaim: controls ? [autoClaim, CustomValidators.required] : autoClaim,
    };
  }
}
