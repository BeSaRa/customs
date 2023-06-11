import { Injectable } from '@angular/core';
import { GlobalSetting } from '@models/global-setting';
import { CastResponseContainer } from 'cast-response';
import { Constructor } from '@app-types/constructors';
import { Pagination } from '@models/pagination';
import { BaseCrudService } from '@abstracts/base-crud-service';

@CastResponseContainer({
  $pagination: {
    model: () => Pagination,
    shape: {
      'rs.*': () => GlobalSetting,
    },
  },
  $default: {
    model: () => GlobalSetting,
  },
})
@Injectable({
  providedIn: 'root',
})
export class GlobalSettingService extends BaseCrudService<GlobalSetting> {
  serviceName = 'GlobalSettingService';

  protected getModelClass(): Constructor<GlobalSetting> {
    return GlobalSetting;
  }

  protected getModelInstance(): GlobalSetting {
    return new GlobalSetting();
  }

  getUrlSegment(): string {
    return this.urlService.URLS.GLOBAL_SETTING;
  }
}
