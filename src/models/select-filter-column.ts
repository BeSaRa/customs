import { FilterColumnContract } from '@contracts/filter-column-contract';
import { isObservable, Observable, of } from 'rxjs';

export class SelectFilterColumn implements FilterColumnContract {
  filter = true;
  type: 'text' | 'select' | 'date' | 'none' = 'select';
  filterName: string;
  bindKey: string;
  options?: Observable<unknown[]>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  bindSelectValue?: string | ((item: any) => any);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  bindSelectLabel?: string | ((item: any) => any);

  constructor(
    public name: string,
    options: unknown[] | Observable<unknown[]>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    bindSelectValue?: string | ((item: any) => any),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    bindSelectLabel?: string | ((item: any) => any),
    bindKey?: string,
  ) {
    this.filterName = this.name + '_filter';
    this.bindKey = bindKey ? bindKey : this.name;
    this.options = isObservable(options) ? options : of(options);
    this.bindSelectLabel = bindSelectLabel;
    this.bindSelectValue = bindSelectValue;
  }
}
