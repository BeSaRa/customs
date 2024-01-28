import { BaseCrudService } from '@abstracts/base-crud-service';
import { Injectable } from '@angular/core';
import { Constructor } from '@app-types/constructors';
import { GuidePanel } from '@models/guide-panel';
import { Pagination } from '@models/pagination';
import { Penalty } from '@models/penalty';
import { CastResponse, CastResponseContainer } from 'cast-response';

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

  @CastResponse(() => Penalty, { unwrap: 'rs', fallback: '$default' })
  loadSearchResult(
    criteria: {
      offenderType: number;
      penaltySigner: number;
      violationTypeId: number;
      repeat: number;
      offenderLevel?: number;
    }[],
  ) {
    return this.http.post<Penalty[]>(this.getUrlSegment(), criteria);
  }
}
