import {
  Component,
  effect,
  inject,
  OnInit,
  signal,
  untracked,
  viewChild,
} from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { AiSearchService } from '@services/ai-search.service';
import { AppStore } from '@stores/app.store';
import { FormControl } from '@angular/forms';
import {
  BehaviorSubject,
  combineLatest,
  debounceTime,
  distinctUntilChanged,
  filter,
  finalize,
  map,
  Subject,
  switchMap,
  takeUntil,
  tap,
} from 'rxjs';
import { SearchQueryContract } from '@contracts/search-query-contract';
import { DEFAULT_SEARCH_QUERY } from '@constants/default-search-query';
import { OnDestroyMixin } from '@mixins/on-destroy-mixin';
import { LangService } from '@services/lang.service';
import {
  Highlight,
  SearchResultContract,
} from '@contracts/search-result-contract';

@Component({
  selector: 'app-ai-search',
  templateUrl: './ai-search.component.html',
  styleUrl: './ai-search.component.scss',
})
export class AiSearchComponent
  extends OnDestroyMixin(class {})
  implements OnInit
{
  paginator = viewChild<MatPaginator>('paginator');
  aiSearchService = inject(AiSearchService);
  store = inject(AppStore);
  lang = inject(LangService);
  searchForm = new FormControl('', { nonNullable: true });
  loadingSubject$ = new Subject<boolean>();
  search$ = new BehaviorSubject<string>('');
  paginate$ = new BehaviorSubject<
    Pick<SearchQueryContract, 'page_number' | 'page_size'>
  >({
    page_number: DEFAULT_SEARCH_QUERY.page_number,
    page_size: DEFAULT_SEARCH_QUERY.page_size,
  });
  total = signal<number>(0);
  searchToken = signal<string>('');
  searchResults$ = this.load();
  isTruncatedContent = signal<boolean[]>([]);
  readonly pageSizeOptions = [5, 10, 20, 30, 40, 50, 100];
  readonly pageSize = DEFAULT_SEARCH_QUERY.page_size;
  animateTrigger = signal<boolean>(false);
  storeEffect = effect(() => {
    if (this.store.isRecordingStopped()) {
      untracked(() => {
        this.prepareForSearch(this.searchForm.value);
      });
    }
  });
  ngOnInit(): void {
    this.listenToSearch();
  }

  load() {
    return combineLatest([this.search$, this.paginate$]).pipe(
      filter(([search]) => search.trim().length > 0),
      tap(([searchToken]) => this.searchToken.set(searchToken)),
      switchMap(([search, paginate]) => {
        const searchQuery: SearchQueryContract = {
          ...DEFAULT_SEARCH_QUERY,
          page_number: paginate.page_number,
          page_size: paginate.page_size,
          query: search,
        };
        this.loadingSubject$.next(true);
        return this.aiSearchService
          .search(searchQuery)
          .pipe(finalize(() => this.loadingSubject$.next(false)));
      }),
      tap(({ total_count, rs }) => {
        this.total.set(total_count);
        this.isTruncatedContent.set(
          Array.from({ length: rs?.length ?? 0 }, () => true),
        );
        this.animateTrigger.set(!this.animateTrigger());
      }),
      map(res => res.rs),
    );
  }

  onPaginate(event: PageEvent) {
    this.paginate$.next({
      page_number: event.pageIndex + 1,
      page_size: event.pageSize,
    });
  }

  listenToSearch() {
    this.searchForm.valueChanges
      .pipe(
        takeUntil(this.destroy$),
        distinctUntilChanged(),
        debounceTime(400),
        filter(
          searchToken =>
            searchToken.trim().length > 0 && this.store.isRecordingStopped(),
        ),
      )
      .subscribe(searchToken => {
        this.prepareForSearch(searchToken, false);
      });
  }
  resetPaginator() {
    if (this.paginator()) {
      this.paginator()!.pageIndex = 0;
      this.paginator()!._changePageSize(this.paginator()!.pageSize);
    }
  }
  prepareForSearch(searchToken: string, resetAfterSearch = true) {
    this.resetPaginator();
    this.search$.next(searchToken);
    if (resetAfterSearch) this.searchForm.reset('', { emitEvent: false });
  }

  getAsHighlight(itemElement: SearchResultContract['@search.highlights']) {
    return itemElement as Highlight;
  }

  getItem(item: SearchResultContract) {
    return item as SearchResultContract;
  }
}
