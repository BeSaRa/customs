import { inject, Injectable } from '@angular/core';
import { CustomMenu } from '@models/custom-menu';
import { CastResponse, CastResponseContainer } from 'cast-response';
import { BaseCrudWithDialogService } from '@abstracts/base-crud-with-dialog-service';
import { ComponentType } from '@angular/cdk/portal';
import { CustomMenuPopupComponent } from '@modules/administration/popups/custom-menu-popup/custom-menu-popup.component';
import { Constructor } from '@app-types/constructors';
import { Pagination } from '@models/pagination';
import { catchError, Observable, of } from 'rxjs';
import { MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { UserClick } from '@enums/user-click';
import { CrudDialogDataContract } from '@contracts/crud-dialog-data-contract';
import { OperationType } from '@enums/operation-type';
import { map } from 'rxjs/operators';
import { HttpParams } from '@angular/common/http';
import { FetchOptionsContract } from '@contracts/fetch-options-contract';
import { CustomMenuSearchCriteria } from '@contracts/custom-menu-search-criteria';
import { isValidValue } from '@utils/utils';
import { MenuItemParametersEnum } from '@enums/menu-item-parameters.enum';
import { EmployeeService } from '@services/employee.service';
import { TokenService } from '@services/token.service';
import { LangService } from '@services/lang.service';
import { MenuView } from '@enums/menu-view';

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
  private employeeService = inject(EmployeeService);
  private tokenService = inject(TokenService);
  private lang = inject(LangService);

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

  openCreatePopup(
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

  loadByCriteriaPaging(
    criteria: Partial<CustomMenuSearchCriteria>,
    options: FetchOptionsContract = {
      offset: 0,
      limit: 50,
    },
  ): Observable<Pagination<CustomMenu[]>> {
    return this._loadByCriteriaPaging(criteria, options);
  }

  @CastResponse(undefined, {
    fallback: '$pagination',
    unwrap: '',
  })
  private _loadByCriteriaPaging(
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
    unwrap: '',
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

  findVariablesInUrl(url: string): string[] {
    if (!isValidValue(url)) {
      return [];
    }
    return url.match(/{(\w+)}/g) ?? [];
  }

  getUrlReplacementValue(variableValue: MenuItemParametersEnum): string {
    let value: string | number | undefined = '';
    switch (variableValue) {
      case MenuItemParametersEnum.USER_ID:
        value = this.employeeService.getEmployee()?.id;
        break;
      case MenuItemParametersEnum.LANG_CODE:
        value = this.lang.getCurrent().code;
        break;
      case MenuItemParametersEnum.USER_TOKEN:
        value = this.tokenService.getToken()?.replace('Bearer ', '');
        break;
      case MenuItemParametersEnum.DOMAIN_NAME:
        value = this.employeeService.getEmployee()?.domainName;
        break;
      case MenuItemParametersEnum.REPORT_TOKEN:
        value = this.tokenService.getReportToken()?.replace('Bearer ', '');
        break;
    }
    return (value ?? '') + '';
  }

  loadPrivateMenus(): Observable<CustomMenu[]> {
    return this.loadByCriteria({ 'menu-view': MenuView.PRIVATE });
  }

  @CastResponse(undefined, {
    fallback: '$default',
    unwrap: 'rs',
  })
  loadByCriteria(
    criteria: Partial<CustomMenuSearchCriteria>,
  ): Observable<CustomMenu[]> {
    delete criteria.offset;
    delete criteria.limit;

    return this.http
      .get<CustomMenu[]>(this.getUrlSegment() + '/criteria', {
        params: new HttpParams({ fromObject: criteria }),
      })
      .pipe(catchError(() => of([])));
  }
}
