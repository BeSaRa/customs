import { Component, inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ContextMenuActionContract } from '@contracts/context-menu-action-contract';
import { OnDestroyMixin } from '@mixins/on-destroy-mixin';
import { ColumnsWrapper } from '@models/columns-wrapper';
import { NoneFilterColumn } from '@models/none-filter-column';
import { SituationSearch } from '@models/situation-search';
import { LangService } from '@services/lang.service';
import { SituationSearchService } from '@services/situation-search.service';
import { ignoreErrors } from '@utils/utils';
import { catchError, exhaustMap, of, throwError } from 'rxjs';

@Component({
  selector: 'app-situation-search',
  templateUrl: './situation-search.component.html',
  styleUrls: ['./situation-search.component.scss'],
})
export class SituationSearchComponent
  extends OnDestroyMixin(class {})
  implements OnInit
{
  data = inject(MAT_DIALOG_DATA);
  id: number = this.data && (this.data.id as number);
  type: number = this.data && (this.data.type as number);
  isCompany: boolean = this.data && (this.data.isCompany as boolean);
  ngOnInit(): void {
    this.loadSituation();
  }
  lang = inject(LangService);
  situationSearchService = inject(SituationSearchService);
  columnsWrapper: ColumnsWrapper<SituationSearch> = new ColumnsWrapper(
    new NoneFilterColumn('repeat'),
    new NoneFilterColumn('violationType'),
    new NoneFilterColumn('offender'),
    new NoneFilterColumn('isProved'),
    new NoneFilterColumn('status'),
  );
  displayedList = new MatTableDataSource<SituationSearch>();

  actions: ContextMenuActionContract<SituationSearch>[] = [];

  private loadSituation() {
    of(null)
      .pipe(
        exhaustMap(() => {
          return this.situationSearchService
            .loadSituation(this.id, this.type, this.isCompany)
            .pipe(
              catchError((error) => {
                return throwError(error);
              }),
              ignoreErrors(),
            );
        }),
      )
      .subscribe((data: SituationSearch[]) => {
        this.displayedList = new MatTableDataSource(data);
      });
  }
  getBooleanString(bool: boolean) {
    return this.lang.getTranslate(bool ? 'yes' : 'no');
  }
}
