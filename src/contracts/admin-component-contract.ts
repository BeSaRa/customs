import { LangService } from '@services/lang.service';
import { Observable, Subject } from 'rxjs';

export interface AdminComponentContract<M, S> {
  lang: LangService;
  service: S;
  filter$: Observable<unknown>;
  sort$: Observable<unknown>;
  edit$: Subject<M>;
  delete$: Subject<M>;
  view$: Subject<M>;
  create$: Subject<void>;
  reload$: Subject<void>;
}
