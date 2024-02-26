export class SuspendEmployee {
  offenderId!: number;
  signerId!: number;
  mawaredEmployee!: number;
  caseId!: string;
  serial!: string;

  decision!: string;
  decisionDate!: string | Date;

  dateFrom!: string | Date;
  dateTo!: string | Date;

  duration!: number;
  type!: number;
  status!: number;

  statusDateModified!: string | Date;
}
