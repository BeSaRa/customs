import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UrlService } from '@services/url.service';

@Injectable({
  providedIn: 'root',
})
export class CacheService {
  private http = inject(HttpClient);
  private urlService = inject(UrlService);

  refreshCache(): Observable<unknown> {
    return this.http.get(this.urlService.URLS.REFRESH_CACHE);
  }
}
