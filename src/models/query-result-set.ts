import { InboxResult } from './inbox-result';
import { IStats } from '@constants/istats';
import { QueryResultSetInterceptor } from '@model-interceptors/query-result-set-interceptor';
import { InterceptModel } from 'cast-response';

const { send, receive } = new QueryResultSetInterceptor();

@InterceptModel({ send, receive })
export class QueryResultSet {
  identifier!: string;
  queryExecuteTime!: string;
  offset!: number;
  size!: number;
  requestedSize!: number;
  totalCount!: number;
  countLimitExceeded!: boolean;
  countLimit!: number;
  stats!: IStats;
  items: InboxResult[] = [];
}
