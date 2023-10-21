import { BaseModel } from '@abstracts/base-model';
import { OffenderService } from '@services/offender.service';
import { AdminResult } from '@models/admin-result';

export class Offender extends BaseModel<Offender, OffenderService> {
  $$__service_name__$$ = 'OffenderService';
  caseId!: string;
  offenderRefId!: number;
  type!: number;
  brokerCompmanyId!: number;
  customsViolationEffect!: number;
  penaltyId!: number;
  linkedPid!: number;
  statusDateModified?: Date | string;
  offenderInfo?: {
    updatedBy: 0;
    updatedOn: '2023-10-16T20:15:23.434Z';
    clientData: 'string';
    arName: 'string';
    enName: 'string';
    qid: 'string';
    type: 0;
    status: 0;
    statusDateModified: '2023-10-16T20:15:23.434Z';
    typeInfo: {
      arName: 'string';
      enName: 'string';
      id: 0;
      fnId: 'string';
      parent: 0;
    };
    statusInfo: {
      arName: 'string';
      enName: 'string';
      id: 0;
      fnId: 'string';
      parent: 0;
    };
    id: 0;
  };
  customsViolationEffectInfo?: AdminResult;
  brokerCompmanyInfo!: AdminResult;
  typeInfo!: AdminResult;
  penaltyInfo!: AdminResult;

  override getNames(): string {
    return (
      (this.offenderInfo &&
        (this.offenderInfo[(this.getLangService().getCurrent().code + 'Name') as keyof typeof this.offenderInfo] as unknown as string)) ||
      ''
    );
  }
}
