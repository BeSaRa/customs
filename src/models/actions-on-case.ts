import { InterceptModel } from 'cast-response';
import { AdminResult } from './admin-result';
import { ActionsOnCaseInterceptor } from '@model-interceptors/actions-on-case-interceptor';

const { send, receive } = new ActionsOnCaseInterceptor();

@InterceptModel({ send, receive })
export class ActionsOnCase {
  updatedOn!: string;
  caseID!: string;
  actionId!: number;
  userFrom!: number;
  ouFrom!: number;
  id!: number;
  userTo!: null;
  ouTo!: null;
  decisionSerial!: null;
  comment!: null;
  offenderIds!: null;
  offenderList!: null;
  status!: null;
  arName!: string;
  enName!: string;
  addedOn!: string;
  time!: string;
  userInfo!: AdminResult;
  offendersInfo!: AdminResult;
  actionInfo!: AdminResult;
  userFromInfo!: AdminResult;
  userToInfo!: AdminResult;
  ouFromInfo!: AdminResult;
  ouToInfo!: AdminResult;
}
