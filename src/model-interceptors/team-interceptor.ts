import { ModelInterceptorContract } from 'cast-response';
import { Team } from '@models/team';
import { AdminResult } from '@models/admin-result';

export class TeamInterceptor implements ModelInterceptorContract<Team> {
  send(model: Partial<Team>): Partial<Team> {
    return model;
  }

  receive(model: Team): Team {
    model.statusInfo = new AdminResult().clone(model.statusInfo);
    return model;
  }
}
