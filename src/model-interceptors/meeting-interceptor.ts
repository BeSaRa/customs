import { ModelInterceptorContract } from 'cast-response';
import { Meeting } from '@models/meeting';

export class MeetingInterceptor implements ModelInterceptorContract<Meeting> {
  send(model: Partial<Meeting>): Partial<Meeting> {
    if (model.meetingDate && model.meetingTime) {
      const date = new Date(model.meetingDate);
      if (model.meetingTime.split(' ')[1].toLowerCase() === 'pm') {
        date.setHours(+model.meetingTime.split(':')[0] + 12);
      } else {
        date.setHours(+model.meetingTime.split(':')[0]);
      }
      date.setMinutes(+model.meetingTime.split(':')[1].split(' ')[0]);

      model.meetingDate = date;
    }
    delete model.meetingTime;
    return model;
  }

  receive(model: Meeting): Meeting {
    model.meetingTime =
      new Date(model.meetingDate).getHours() +
      ':' +
      new Date(model.meetingDate).getMinutes();
    return model;
  }
}
