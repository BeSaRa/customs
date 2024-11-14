import { ModelInterceptorContract } from 'cast-response';
import { UserGuide } from '@models/user-guide';

export class UserGuideInterceptor implements ModelInterceptorContract<UserGuide> {
  send(model: Partial<UserGuide>): Partial<UserGuide> {
    return model;
  }

  receive(model: UserGuide): UserGuide {
    return model;
  }
}
