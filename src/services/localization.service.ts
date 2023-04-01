import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Localization } from '@models/localization';
import { UrlService } from '@services/url.service';
import { CastResponse } from 'cast-response';
import { BaseServiceMixin } from '@mixins/base-service-mixin';

@Injectable({
  providedIn: 'root',
})
export class LocalizationService extends BaseServiceMixin(class {}) {
  constructor(private http: HttpClient, private urlService: UrlService) {
    super();
  }

  @CastResponse(() => Localization)
  load(): Observable<Localization[]> {
    return this.http.get<Localization[]>(this.urlService.URLS.LOCALIZATION);
  }
}
