import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { UrlService } from './url.service';

@Injectable({
  providedIn: 'root',
})
export class AzureAdminService {
  private readonly _http = inject(HttpClient);
  private readonly _urlService = inject(UrlService);
  private _url = this._urlService.AZURE_URLS.BASE_URL + '/admin';

  getSasToken(blobUrl: string) {
    return this._http.get<string>(this._url + '/sas-token', {
      params: new HttpParams({
        fromObject: {
          blob_url: blobUrl,
        },
      }),
    });
  }
}
