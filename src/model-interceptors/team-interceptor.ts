import { ModelInterceptorContract } from 'cast-response';
import { Team } from '@models/team';

export class TeamInterceptor implements ModelInterceptorContract<Team> {
  send(model: Partial<Team>): Partial<Team> {
    return model;
  }

  receive(model: Team): Team {
    return model;
  }
}
