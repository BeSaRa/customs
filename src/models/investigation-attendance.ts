import { Cloner } from '@abstracts/cloner';

export class InvestigationAttendance extends Cloner {
  id!: number;
  attendeeId!: number;
  category!: number;
  status: number = 1;
  attendeeName!: string;
  qid!: string;
}
