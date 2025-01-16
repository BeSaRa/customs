import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { UrlService } from './url.service';
import { Observable } from 'rxjs';
import { PaginationResultContract } from '@contracts/pagination-result-contract';
import { SearchResultContract } from '@contracts/search-result-contract';
import { SearchQueryContract } from '@contracts/search-query-contract';

@Injectable({
  providedIn: 'root',
})
export class AiSearchService {
  private readonly http = inject(HttpClient);
  private readonly urlService = inject(UrlService);

  search(
    searchQuery: SearchQueryContract,
  ): Observable<PaginationResultContract<SearchResultContract>> {
    console.log(this.urlService.URLS.BASE_URL);
    const url = `https://ebla-ai-demo-002.azurewebsites.net/api/v1/search/search/website`;
    return this.http.post<PaginationResultContract<SearchResultContract>>(
      url,
      searchQuery,
    );
  }
}
