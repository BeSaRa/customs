import { Injectable } from '@angular/core';
import { GlobalSetting } from '@models/global-setting';
import { CastResponseContainer } from 'cast-response';
import { BaseCrudWithDialogService } from '@abstracts/base-crud-with-dialog-service';
import { ComponentType } from '@angular/cdk/portal';
import { GlobalSettingPopupComponent } from '@modules/administration/popups/global-setting-popup/global-setting-popup.component';
import { Constructor } from '@app-types/constructors';
import { Pagination } from '@models/pagination';

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
export class GlobalSettingService extends BaseCrudWithDialogService<GlobalSettingPopupComponent, GlobalSetting> {
  serviceName = 'GlobalSettingService';
  protected getModelClass(): Constructor<GlobalSetting> {
    return GlobalSetting;
  }

  protected getModelInstance(): GlobalSetting {
    return new GlobalSetting();
  }

  getDialogComponent(): ComponentType<GlobalSettingPopupComponent> {
    return GlobalSettingPopupComponent;
  }

  getUrlSegment(): string {
    return this.urlService.URLS.GLOBAL_SETTING;
  }
}
