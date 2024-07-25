import { Injectable } from '@angular/core';
import { CustomMenu } from '@models/custom-menu';
import { CastResponse, CastResponseContainer } from 'cast-response';
import { BaseCrudWithDialogService } from '@abstracts/base-crud-with-dialog-service';
import { ComponentType } from '@angular/cdk/portal';
import { CustomMenuPopupComponent } from '@modules/administration/popups/custom-menu-popup/custom-menu-popup.component';
import { Constructor } from '@app-types/constructors';
import { Pagination } from '@models/pagination';
import { Observable, of, switchMap } from 'rxjs';
import { MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { UserClick } from '@enums/user-click';
import { CrudDialogDataContract } from '@contracts/crud-dialog-data-contract';
import { OperationType } from '@enums/operation-type';

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

  override openViewDialog(
    model: CustomMenu,
    extras: {
      modelId: number;
      parentMenu?: CustomMenu;
      selectedPopupTab: string;
    },
    config?: Omit<MatDialogConfig<unknown>, 'data'> | undefined,
  ): MatDialogRef<CustomMenuPopupComponent, UserClick.CLOSE> {
    const dialogComponent = this.getDialogComponent();

    let dialogRef:
      | MatDialogRef<CustomMenuPopupComponent, UserClick.CLOSE>
      | undefined;

    this.getById(extras.modelId).subscribe((item: CustomMenu) => {
      dialogRef = this.dialog.open<
        CustomMenuPopupComponent,
        CrudDialogDataContract<CustomMenu>,
        UserClick.CLOSE
      >(dialogComponent, {
        ...config,
        disableClose: true,
        data: {
          model: item,
          extras: { ...extras },
          operation: OperationType.VIEW,
        },
      });
    });

    return dialogRef!;
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
}
