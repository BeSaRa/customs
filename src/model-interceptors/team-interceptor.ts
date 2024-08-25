import { ModelInterceptorContract } from 'cast-response';
import { Team } from '@models/team';
import { AdminResult } from '@models/admin-result';

export class TeamInterceptor implements ModelInterceptorContract<Team> {
  send(model: Partial<Team>): Partial<Team> {
    if (model.customSettings) {
      model.customSettings = JSON.stringify({
        secretary: model.secretary,
        president: model.president,
      });
    }
    delete model.secretary;
    delete model.president;
    return model;
  }

  receive(model: Team): Team {
    model.statusInfo = new AdminResult().clone(model.statusInfo);
    if (model.customSettings) {
      const { secretary, president } = JSON.parse(model.customSettings);
      model.secretary = secretary;
      model.president = president;
    }
    return model;
  }
}
