import { InterceptModel } from 'cast-response';
import { ObligationToAttendInterceptor } from '@model-interceptors/obligation-to-attend-interceptor';
import { AdminResult } from '@models/admin-result';

const { receive } = new ObligationToAttendInterceptor();

@InterceptModel({ receive })
export class PersonDetails {
  id!: number;
  updatedOn!: string;
  arName!: string;
  enName!: string;
  qid!: string;
  type!: number;
  address!: string;
  phoneNumber!: string;
  email!: string;
  status!: number;
  statusDateModified!: string;
  typeInfo!: AdminResult;
  statusInfo!: AdminResult;
}
