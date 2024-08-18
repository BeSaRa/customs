import { FilterColumnContract } from '@contracts/filter-column-contract';
import { BehaviorSubject, Subject } from 'rxjs';
import { ColumnMapContract } from '@contracts/column-map-contract';
import { LangCodes } from '@enums/lang-codes';

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
  private langCode$!: BehaviorSubject<LangCodes>;

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

  setLangCode(langCode$: BehaviorSubject<LangCodes>): this {
    this.langCode$ = langCode$;
    this.langCode$.subscribe(code => {
      this.updateColumns(code);
    });
    return this;
  }

  private updateColumns(langCode?: LangCodes): void {
    const langColumnName = langCode + 'Name';
    this.displayedColumns = [];
    this.filteredColumns = [];

    this.list.forEach(column => {
      const shouldDisplay =
        column.name === langColumnName ||
        !['arName', 'enName'].includes(column.name);

      if (shouldDisplay) {
        this.displayedColumns.push(column.name);
        this.filteredColumns.push(column.filterName);

        this.columnsMap[column.filterName] = {
          config: column,
          filter: () => this.filter$,
          clear: this.clear$,
        } as ColumnMapContract<M>;
      }
    });
  }
}
