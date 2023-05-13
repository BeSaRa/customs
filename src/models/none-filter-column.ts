import { FilterColumnContract } from '@contracts/filter-column-contract';

export class NoneFilterColumn implements FilterColumnContract {
  filter = false;
  type: 'text' | 'select' | 'date' | 'none' = 'none';
  filterName = '';
  options?: unknown[];
  bindKey = '';
  constructor(public name: string) {
    this.filterName = this.name + '_filter';
  }
}
