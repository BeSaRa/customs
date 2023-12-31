import { ModelInterceptorContract } from 'cast-response';
import { UserTeam } from '@models/user-team';
import { AdminResult } from '@models/admin-result';

export class UserTeamInterceptor implements ModelInterceptorContract<UserTeam> {
  send(model: Partial<UserTeam>): Partial<UserTeam> {
    return model;
  }

  receive(model: UserTeam): UserTeam {
    model.teamInfo && (model.teamInfo = AdminResult.createInstance(model.teamInfo));
    model.internalUserInfo && (model.internalUserInfo = AdminResult.createInstance(model.internalUserInfo));
    model.statusInfo && (model.statusInfo = AdminResult.createInstance(model.statusInfo));
    return model;
  }
}
