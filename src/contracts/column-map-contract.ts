import { FilterColumnContract } from '@contracts/filter-column-contract';
import { BehaviorSubject, Subject } from 'rxjs';

export interface ColumnMapContract<M> {
  config: FilterColumnContract;
  clear: Subject<void>;
  filter: () => BehaviorSubject<Partial<M>>;
}
