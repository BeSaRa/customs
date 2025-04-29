import { InterceptModel } from 'cast-response';
import { CallRequestInterceptor } from '@model-interceptors/call-request-interceptor';
import { AdminResult } from '@models/admin-result';

const { receive } = new CallRequestInterceptor();

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
  employeeDepartmentId!: number;
  typeInfo!: AdminResult;
  statusInfo!: AdminResult;
}
