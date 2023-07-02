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
  clientData = '';
  statusDateModified = '';
  statusInfo!: AdminResult;
  qId!: number;
  clientIP = '';
  // extra properties
  statusDateModifiedString!: string;
  updatedOnString!: string;
}
