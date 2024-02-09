import { ActionsOnCase } from '@models/actions-on-case';
import { AdminResult } from '@models/admin-result';
import { ModelInterceptorContract } from 'cast-response';

export class ActionsOnCaseInterceptor
  implements ModelInterceptorContract<ActionsOnCase>
{
  send(model: Partial<ActionsOnCase>): Partial<ActionsOnCase> {
    return model;
  }

  receive(model: ActionsOnCase): ActionsOnCase {
    model.userInfo &&
      (model.userInfo = AdminResult.createInstance(model.userInfo));
    model.offendersInfo &&
      (model.offendersInfo = AdminResult.createInstance(model.offendersInfo));
    model.actionInfo &&
      (model.actionInfo = AdminResult.createInstance(model.actionInfo));
    model.userFromInfo &&
      (model.userFromInfo = AdminResult.createInstance(model.userFromInfo));
    model.userToInfo &&
      (model.userToInfo = AdminResult.createInstance(model.userToInfo));
    model.ouFromInfo &&
      (model.ouFromInfo = AdminResult.createInstance(model.ouFromInfo));
    model.ouToInfo &&
      (model.ouToInfo = AdminResult.createInstance(model.ouToInfo));
    model.addedOn = new Date(model.addedOn).toLocaleDateString();
    return model;
  }
}
