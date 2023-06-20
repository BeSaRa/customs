import { LangService } from '@services/lang.service';
import { Observable, Subject } from 'rxjs';

export interface AuditComponentContract<S> {
  lang: LangService;
  service: S;
  sort$: Observable<unknown>;
  reload$: Subject<void>;
}
