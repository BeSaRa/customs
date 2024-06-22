import { Cloner } from '@abstracts/cloner';

export class InvestigationAttendance extends Cloner {
  id!: number;
  attendeeId!: number;
  category!: number;
  attendeeName!: string;
  qid!: string;
}
