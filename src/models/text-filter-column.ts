import { FilterColumnContract } from '@contracts/filter-column-contract';

export class TextFilterColumn implements FilterColumnContract {
  filter = true;
  type: 'text' | 'select' | 'date' | 'none' = 'text';
  filterName = '';
  bindKey: string;

  constructor(public name: string, bindKey?: string) {
    this.filterName = this.name + '_filter';
    this.bindKey = bindKey ? bindKey : this.name;
  }
}
