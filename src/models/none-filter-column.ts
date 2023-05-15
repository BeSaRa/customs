import { FilterColumnContract } from '@contracts/filter-column-contract';
import { Observable } from 'rxjs';

export class NoneFilterColumn implements FilterColumnContract {
  filter = false;
  type: 'text' | 'select' | 'date' | 'none' = 'none';
  filterName = '';
  options?: Observable<unknown[]>;
  bindKey = '';
  constructor(public name: string) {
    this.filterName = this.name + '_filter';
  }
}
