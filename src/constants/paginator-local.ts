import { MatPaginatorIntl } from '@angular/material/paginator';
import { Subject, takeUntil } from 'rxjs';
import { inject, Injectable, OnDestroy } from '@angular/core';
import { LangService } from '@services/lang.service';
import { OnDestroyMixin } from '@mixins/on-destroy-mixin';

@Injectable()
export class PaginatorLocal
  extends OnDestroyMixin(MatPaginatorIntl)
  implements OnDestroy
{
  override changes = new Subject<void>();

  lang = inject(LangService);

  override firstPageLabel = `First page`;
  override itemsPerPageLabel = `Items per page:`;
  override lastPageLabel = `Last page`;

  override nextPageLabel = 'Next page';
  override previousPageLabel = 'Previous page';

  constructor() {
    super();
    this.listenToLanguageChange();
    this.translatePaginator();
  }

  override getRangeLabel = (
    page: number,
    pageSize: number,
    length: number
  ): string => {
    if (length === 0) {
      return `${this.lang.getTranslate('paginator_page_label')} 1 of 1`;
    }
    const amountPages = Math.ceil(length / pageSize);
    return `${this.lang.getTranslate('paginator_page_label')} ${
      page + 1
    } ${this.lang.getTranslate('paginator_of_label')} ${amountPages}`;
  };

  private listenToLanguageChange() {
    this.lang.change$.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.translatePaginator();
    });
  }

  private translatePaginator() {
    this.firstPageLabel = this.lang.getTranslate('paginator_first_page_label');
    this.itemsPerPageLabel = this.lang.getTranslate(
      'paginator_items_per_page_label'
    );
    this.lastPageLabel = this.lang.getTranslate('paginator_last_page_label');
    this.nextPageLabel = this.lang.getTranslate('paginator_next_page_label');
    this.previousPageLabel = this.lang.getTranslate(
      'paginator_previous_page_label'
    );
    this.changes.next();
  }
}
