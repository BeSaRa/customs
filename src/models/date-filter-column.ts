import { FilterColumnContract } from '@contracts/filter-column-contract';

export class DateFilterColumn implements FilterColumnContract {
  filter = true;
  type: 'text' | 'select' | 'date' | 'none' = 'date';
  filterName: string;
  bindKey: string;

  constructor(public name: string, bindKey?: string) {
    this.filterName = this.name + '_filter';
    this.bindKey = bindKey ? bindKey : this.name;
  }
}
