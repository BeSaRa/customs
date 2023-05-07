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

  buildForm(controls = false): object {
    const { ldapGroupName, arName, enName } = this;
    return {
      ldapGroupName: controls
        ? [ldapGroupName, CustomValidators.required]
        : ldapGroupName,
      arName: controls ? [arName, CustomValidators.required] : arName,
      enName: controls ? [enName, CustomValidators.required] : enName,
    };
  }
}
