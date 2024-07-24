import { Injectable } from '@angular/core';
import { CustomMenu } from '@models/custom-menu';
import { CastResponseContainer } from 'cast-response';
import { BaseCrudWithDialogService } from '@abstracts/base-crud-with-dialog-service';
import { ComponentType } from '@angular/cdk/portal';
import { CustomMenuPopupComponent } from '@modules/administration/popups/custom-menu-popup/custom-menu-popup.component';
import { Constructor } from '@app-types/constructors';
import { Pagination } from '@models/pagination';
    
@CastResponseContainer({
  $pagination: {
    model: () => Pagination,
    shape: {
      'rs.*': () => CustomMenu,
    },
  },
  $default: {
    model: () => CustomMenu,
  },
})
@Injectable({
  providedIn: 'root',
})
export class CustomMenuService extends BaseCrudWithDialogService<
CustomMenuPopupComponent,
CustomMenu> {
  serviceName = 'CustomMenuService';
  protected getModelClass(): Constructor<CustomMenu> {
    return CustomMenu;
  }

  protected getModelInstance(): CustomMenu {
    return new CustomMenu();
  }

  getDialogComponent(): ComponentType<CustomMenuPopupComponent> {
    return CustomMenuPopupComponent;
  }

  getUrlSegment(): string {
    return this.urlService.URLS.CUSTOM_MENU;
  }
}
