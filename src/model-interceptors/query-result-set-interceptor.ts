import { QueryResultSet } from '@models/query-result-set';
import { InboxInterceptor } from './inbox-interceptor';
import { InboxResult } from '@models/inbox-result';
import { ModelInterceptorContract } from 'cast-response';

const inboxInterceptor: InboxInterceptor = new InboxInterceptor();

export class QueryResultSetInterceptor
  implements ModelInterceptorContract<QueryResultSet>
{
  receive(model: QueryResultSet): QueryResultSet {
    model.items = model.items.map((item) => {
      return inboxInterceptor.receive(new InboxResult().clone(item));
    });
    return model;
  }

  send(model: Partial<QueryResultSet>): Partial<QueryResultSet> {
    return model;
  }
}
