import { ModelInterceptorContract } from 'cast-response';
import { Meeting } from '@models/meeting';

export class MeetingInterceptor implements ModelInterceptorContract<Meeting> {
  send(model: Partial<Meeting>): Partial<Meeting> {
    if (model.meetingDate && model.meetingTime) {
      const date = new Date(model.meetingDate);
      date.setHours(+model.meetingTime.split(':')[0]);
      date.setMinutes(+model.meetingTime.split(':')[1].split(' ')[0]);

      model.meetingDate = date;
    }
    delete model.meetingTime;
    return model;
  }

  receive(model: Meeting): Meeting {
    console.log(model);
    return model;
  }
}
