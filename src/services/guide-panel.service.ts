import { BaseCrudService } from '@abstracts/base-crud-service';
import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Constructor } from '@app-types/constructors';
import { FetchOptionsContract } from '@contracts/fetch-options-contract';
import { GuidePanel } from '@models/guide-panel';
import { Pagination } from '@models/pagination';
import { CastResponse, CastResponseContainer } from 'cast-response';
import { Observable } from 'rxjs';

@CastResponseContainer({
  $pagination: {
    model: () => Pagination,
    shape: {
      'rs.items.*': () => GuidePanel,
    },
  },
  $default: {
    model: () => GuidePanel,
  },
})
@Injectable({
  providedIn: 'root',
})
export class GuidePanelService extends BaseCrudService<GuidePanel> {
  serviceName = 'GuidePanelService';

  protected getModelClass(): Constructor<GuidePanel> {
    return GuidePanel;
  }

  protected getModelInstance(): GuidePanel {
    return new GuidePanel();
  }

  getUrlSegment(): string {
    return this.urlService.URLS.GUIDE_PANEL;
  }

  @CastResponse(undefined, {
    unwrap: '',
    fallback: '',
  })
  loadSearchResult(criteria: any) {
    return this.http.get(this.getUrlSegment(), {
      params: new HttpParams({ fromObject: criteria }),
    });
  }
}
