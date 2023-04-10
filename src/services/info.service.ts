import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable, tap } from 'rxjs';
import { UrlService } from '@services/url.service';
import { InfoContract } from '@contracts/info-contract';
import { ResponseContract } from '@contracts/response-contract';
import { LangService } from '@services/lang.service';

@Injectable({
  providedIn: 'root',
})
export class InfoService {
  info!: InfoContract;
  private lang = inject(LangService);
  private http = inject(HttpClient);
  private urlService = inject(UrlService);

  load(): Observable<InfoContract> {
    return this.http
      .get<ResponseContract<InfoContract>>(this.urlService.URLS.INFO)
      .pipe(map((res) => res.rs))
      .pipe(tap((res) => (this.info = res)))
      .pipe(tap((res) => this.lang.prepareLanguages(res.localizationSet)));
  }
}
