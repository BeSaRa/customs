import { ModelInterceptorContract } from 'cast-response';
import { Meeting } from '@models/meeting';

export class MeetingInterceptor implements ModelInterceptorContract<Meeting> {
  send(model: Partial<Meeting>): Partial<Meeting> {
    return model;
  }

  receive(model: Meeting): Meeting {
    return model;
  }
}
