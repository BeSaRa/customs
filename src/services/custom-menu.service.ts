import { Injectable } from '@angular/core';
import { CustomMenu } from '@models/custom-menu';
import { CastResponse, CastResponseContainer } from 'cast-response';
import { BaseCrudWithDialogService } from '@abstracts/base-crud-with-dialog-service';
import { ComponentType } from '@angular/cdk/portal';
import { CustomMenuPopupComponent } from '@modules/administration/popups/custom-menu-popup/custom-menu-popup.component';
import { Constructor } from '@app-types/constructors';
import { Pagination } from '@models/pagination';
import { Observable, switchMap } from 'rxjs';
import { MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { UserClick } from '@enums/user-click';
import { CrudDialogDataContract } from '@contracts/crud-dialog-data-contract';
import { OperationType } from '@enums/operation-type';
import { map } from 'rxjs/operators';
import { HttpParams } from '@angular/common/http';
import { FetchOptionsContract } from '@contracts/fetch-options-contract';
import { CustomMenuSearchCriteria } from '@contracts/custom-menu-search-criteria';

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
  CustomMenu
> {
  serviceName = 'CustomMenuService';
  list: CustomMenu[] = [];
  dynamicMainMenuUrl: string = 'home/dynamic-menus/:parentId';
  dynamicMainMenuDetailsUrl: string = 'home/dynamic-menus/:parentId/details';
  dynamicChildMenuUrl: string = 'home/dynamic-menus/:parentId/details/:id';

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

  openViewPopup(
    model: CustomMenu,
    extras: {
      modelId: number;
      parentMenu?: CustomMenu;
      selectedPopupTab: number;
    },
    config?: Omit<MatDialogConfig<unknown>, 'data'>,
  ) {
    return this.getById(extras.modelId).pipe(
      map((item: CustomMenu) => {
        return this.dialog.open<
          CustomMenuPopupComponent,
          CrudDialogDataContract<CustomMenu>,
          UserClick.CLOSE
        >(this.getDialogComponent(), {
          ...config,
          disableClose: true,
          data: {
            model: item,
            extras: { ...extras },
            operation: OperationType.VIEW,
          },
        });
      }),
    );
  }

  override openCreateDialog(
    model: CustomMenu,
    extras: { parentMenu?: CustomMenu },
    config?: Omit<MatDialogConfig<unknown>, 'data'> | undefined,
  ): MatDialogRef<CustomMenuPopupComponent, CustomMenu | UserClick.CLOSE> {
    const data = new CustomMenu();
    const parentMenu = extras?.parentMenu;
    if (parentMenu) {
      data.parentMenuItemId = parentMenu.id;
      data.menuView = parentMenu.menuView;
      data.menuType = parentMenu.menuType;
      data.userType = parentMenu.userType;
      data.status = parentMenu.status;
      data.hasSystemParent = parentMenu.isSystem;
    }

    return this.dialog.open<
      CustomMenuPopupComponent,
      CrudDialogDataContract<CustomMenu>,
      CustomMenu | UserClick.CLOSE
    >(this.getDialogComponent(), {
      ...config,
      disableClose: true,
      data: {
        model: data || this.getModelInstance(),
        extras: { parent: parent },
        operation: OperationType.CREATE,
      },
    });
  }

  openEditPopup(
    model: CustomMenu,
    extras: {
      modelId: number;
      parentMenu?: CustomMenu;
      selectedPopupTab: number;
    },
    config?: Omit<MatDialogConfig<unknown>, 'data'>,
  ) {
    return this.getById(extras.modelId).pipe(
      map((item: CustomMenu) => {
        return this.dialog.open<
          CustomMenuPopupComponent,
          CrudDialogDataContract<CustomMenu>,
          UserClick.CLOSE
        >(this.getDialogComponent(), {
          ...config,
          disableClose: true,
          data: {
            model: item,
            extras: { ...extras },
            operation: OperationType.UPDATE,
          },
        });
      }),
    );
  }

  @CastResponse(() => CustomMenu, {
    fallback: '$default',
    unwrap: 'rs',
  })
  loadMenuTree(): Observable<CustomMenu[]> {
    return this.http.get<CustomMenu[]>(this.getUrlSegment() + '/tree');
  }

  getById(modelId: number): Observable<CustomMenu> {
    return this._getById(modelId);
  }

  @CastResponse(undefined, {
    fallback: '$default',
    unwrap: 'rs',
  })
  private _getById(modelId: number): Observable<CustomMenu> {
    return this.http.get<CustomMenu>(this.getUrlSegment() + '/' + modelId);
  }

  @CastResponse(undefined, {
    fallback: '$pagination',
  })
  loadByCriteriaPaging(
    criteria: Partial<CustomMenuSearchCriteria>,
    options: FetchOptionsContract = {
      offset: 0,
      limit: 50,
    },
  ): Observable<Pagination<CustomMenu[]>> {
    criteria.offset = options.offset;
    criteria.limit = options.limit;

    return this.http.get<Pagination<CustomMenu[]>>(
      this.getUrlSegment() + '/criteria',
      {
        params: new HttpParams({ fromObject: criteria }),
      },
    );
  }

  loadMain(options: {
    offset: number;
    limit: number;
  }): Observable<Pagination<CustomMenu[]>> {
    return this._loadMain(options);
  }

  @CastResponse(undefined, {
    fallback: '$pagination',
  })
  private _loadMain(options: {
    offset: number;
    limit: number;
  }): Observable<Pagination<CustomMenu[]>> {
    return this.http.get<Pagination<CustomMenu[]>>(
      this.getUrlSegment() + '/main',
      {
        params: { ...options },
      },
    );
  }
}
