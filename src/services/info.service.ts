import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable, tap } from 'rxjs';
import { UrlService } from '@services/url.service';
import { InfoContract } from '@contracts/info-contract';
import { ResponseContract } from '@contracts/response-contract';

@Injectable({
  providedIn: 'root',
})
export class InfoService {
  info!: InfoContract;

  constructor(private http: HttpClient, private urlService: UrlService) {}

  load(): Observable<InfoContract> {
    return this.http
      .get<ResponseContract<InfoContract>>(this.urlService.URLS.INFO)
      .pipe(map((res) => res.rs))
      .pipe(tap((res) => (this.info = res)));
  }
}
