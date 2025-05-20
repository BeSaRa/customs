import { ModelInterceptorContract } from 'cast-response';
import { Team } from '@models/team';
import { AdminResult } from '@models/admin-result';

export class TeamInterceptor implements ModelInterceptorContract<Team> {
  send(model: Partial<Team>): Partial<Team> {
    if (model.customSettings) {
      model.customSettings = JSON.stringify({
        secretary: model.secretary,
        president: model.president,
        member1: model.member1,
        member2: model.member2,
      });
    }
    delete model.secretary;
    delete model.president;
    delete model.member1;
    delete model.member2;
    return model;
  }

  receive(model: Team): Team {
    model.statusInfo = new AdminResult().clone(model.statusInfo);
    if (model.customSettings) {
      const { secretary, president, member1, member2 } = JSON.parse(
        model.customSettings,
      );
      model.secretary = secretary;
      model.president = president;
      model.member1 = member1;
      model.member2 = member2;
    }
    return model;
  }
}
