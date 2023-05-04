import { BaseModel } from '@abstracts/base-model';
import { TeamService } from '@services/team.service';
import { TeamInterceptor } from '@model-interceptors/team-interceptor';
import { InterceptModel } from 'cast-response';

const { send, receive } = new TeamInterceptor();

@InterceptModel({ send, receive })
export class Team extends BaseModel<Team, TeamService> {
  $$__service_name__$$ = 'TeamService';
  status!: number | null;

  buildForm(controls = false): object {
    return {};
  }
}
