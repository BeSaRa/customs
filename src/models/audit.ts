import { InterceptModel } from 'cast-response';
import { AdminResult } from './admin-result';
import { AuditInterceptor } from '@model-interceptors/audit-interceptor';

const { send, receive } = new AuditInterceptor();

@InterceptModel({ send, receive })
export class Audit {
  auditId!: number;
  updatedOn!: string;
  operation!: number;
  operationInfo!: AdminResult;
  status!: number;
  orgInfo!: AdminResult;
  userInfo!: AdminResult;
  clientData: string = '';
  statusDateModified: string = '';
  statusInfo!: AdminResult;
  qId!: number;
  clientIP: string = '';

  // extra properties
  statusDateModifiedString!: string;
  updatedOnString!: string;
}
