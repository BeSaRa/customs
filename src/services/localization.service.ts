import { Injectable } from '@angular/core';
import { BaseService } from '@abstracts/base-service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Localization } from '@models/localization';
import { UrlService } from '@services/url.service';
import { CastResponse } from 'cast-response';

@Injectable({
  providedIn: 'root',
})
export class LocalizationService extends BaseService {
  serviceName = 'LocalizationService';

  constructor(private http: HttpClient, private urlService: UrlService) {
    super();
  }

  @CastResponse(() => Localization)
  load(): Observable<Localization[]> {
    return this.http.get<Localization[]>(this.urlService.URLS.LOCALIZATION);
  }
}
