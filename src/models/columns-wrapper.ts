import { FilterColumnContract } from '@contracts/filter-column-contract';
import { BehaviorSubject, Subject } from 'rxjs';
import { ColumnMapContract } from '@contracts/column-map-contract';

export class ColumnsWrapper<M> {
  private readonly list: FilterColumnContract[] = [];
  public displayedColumns: string[] = [];
  public filteredColumns: string[] = [];
  private clear$ = new Subject<void>();
  public columnsMap: Record<string, ColumnMapContract<M>> = {} as Record<
    string,
    ColumnMapContract<M>
  >;
  private filter$!: BehaviorSubject<Partial<M>>;
  constructor(...args: FilterColumnContract[]) {
    this.list = args;
    this.list.forEach(colum => {
      this.displayedColumns.push(colum.name);
      this.filteredColumns.push(colum.filterName);
      this.columnsMap[colum.filterName] = {} as ColumnMapContract<M>;
      this.columnsMap[colum.filterName]['config'] = colum;
      this.columnsMap[colum.filterName]['filter'] = () => this.filter$;
      this.columnsMap[colum.filterName]['clear'] = this.clear$;
    });
  }

  attacheFilter(filter: BehaviorSubject<Partial<M>>): this {
    this.filter$ = filter;
    return this;
  }
}
