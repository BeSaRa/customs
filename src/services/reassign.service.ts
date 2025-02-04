import { DialogService } from '@services/dialog.service';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { UrlService } from '@services/url.service';

@Injectable({
  providedIn: 'root',
})
export class ReassignService {
  serviceName: string = 'ReassignService';
  protected dialog = inject(DialogService);
  protected http: HttpClient = inject(HttpClient);
  protected urlService: UrlService = inject(UrlService);

  getUrlSegment(): string {
    return this.urlService.URLS.TASK_INBOX;
  }
  reassign(params: { tkiid: string; caseId: string; toUser: string }) {
    return this.http.post(
      `${this.getUrlSegment()}/reassign`,
      {},
      {
        params: new HttpParams()
          .set('tkiid', params.tkiid)
          .set('caseId', params.caseId)
          .set('toUser', params.toUser),
      },
    );
  }
}
