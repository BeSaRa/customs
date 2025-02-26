import { CustomMenuInterceptor } from '@model-interceptors/custom-menu-interceptor';
import { InterceptModel } from 'cast-response';
import { CustomMenuService } from '@services/custom-menu.service';
import { BaseModel } from '@abstracts/base-model';
import { StatusTypes } from '@enums/status-types';
import { AdminResult } from '@models/admin-result';
import { MenuItemContract } from '@contracts/menu-item-contract';
import { MenuUrlValueContract } from '@contracts/menu-url-value-contract';
import { CustomValidators } from '@validators/custom-validators';
import { LangKeysContract } from '@contracts/lang-keys-contract';
import { AppFullRoutes } from '@constants/app-full-routes';
import { MenuTypes } from '@enums/menu-types';

const { send, receive } = new CustomMenuInterceptor();

@InterceptModel({ send, receive })
export class CustomMenu extends BaseModel<CustomMenu, CustomMenuService> {
  $$__service_name__$$ = 'CustomMenuService';

  override status: number = StatusTypes.ACTIVE;
  menuOrder!: number;
  menuType!: number;
  menuView!: number;
  userType!: number;
  menuURL!: string;
  urlParams!: string;
  parentMenuItemId?: number;
  statusDateModified!: string;
  menuTypeInfo!: AdminResult;
  menuViewInfo!: AdminResult;
  parentMenuItemInfo!: AdminResult;
  userTypeInfo!: AdminResult;
  subMenuItems: CustomMenu[] = [];
  defaultParent?: MenuItemContract;
  systemMenuKey?: string;
  icon!: string;
  isSystem!: boolean;

  // extra properties
  urlParamsParsed: MenuUrlValueContract[] = [];
  customParentId!: number;
  isSystemParent: boolean = false;
  hasSystemParent: boolean = false;

  buildForm(controls?: boolean) {
    const {
      arName,
      enName,
      menuOrder,
      menuType,
      menuView,
      parentMenuItemId,
      systemMenuKey,
    } = this;
    return {
      arName: controls
        ? [
            arName,
            [CustomValidators.required, CustomValidators.pattern('AR_ONLY')],
          ]
        : arName,
      enName: controls
        ? [
            enName,
            [CustomValidators.required, CustomValidators.pattern('ENG_ONLY')],
          ]
        : enName,
      menuOrder: controls
        ? [menuOrder, [CustomValidators.required, CustomValidators.number]]
        : menuOrder,
      menuType: controls ? [menuType, [CustomValidators.required]] : menuType,
      menuView: controls ? [menuView, []] : menuView,
      parentMenuItemId: controls ? [parentMenuItemId, []] : parentMenuItemId,
      systemMenuKey: controls ? [systemMenuKey, []] : systemMenuKey,
    };
  }

  buildMenuUrlForm(controls?: boolean) {
    const { menuURL } = this;
    return {
      menuURL: controls ? [menuURL] : menuURL,
    };
  }

  isParentMenu(): boolean {
    return !this.parentMenuItemId;
  }

  isDefaultItem() {
    return this.isSystem;
  }

  hasDefaultParent(parent?: CustomMenu) {
    if (!parent?.isSystem) return false;
    return this.parentMenuItemId === parent?.id;
  }

  isSystemParentItem(): boolean {
    return !!this.systemMenuKey && this.isSystemParent;
  }

  getChildrenIds(): number[] {
    return this.subMenuItems.map(x => x.id);
  }

  // static clone(data: Partial<CustomMenu>): CustomMenu {
  //   const instance = new CustomMenu();
  //   Object.assign(instance, data);
  //   return instance;
  // }

  convertToMenuItem(): MenuItemContract {
    const id = 'D' + this.id;
    const parentId = this.parentMenuItemId
      ? 'D' + this.parentMenuItemId
      : undefined;

    return {
      arName: this.arName,
      enName: this.enName,
      langKey: id as keyof LangKeysContract,
      id,
      parent: parentId,
      path:
        AppFullRoutes.DYNAMIC_MENU +
        '/' +
        (parentId ? `${parentId}/details/${id}` : `${id}/details`),
      customMenu: this,
      icon: this.menuType === MenuTypes.REPORTS ? 'chart-pie' : 'web',
    };
  }

  parseUrl(): string {
    const service = this.$$getService$$<CustomMenuService>();

    const variables = service.findVariablesInUrl(this.menuURL);
    let url: string = this.menuURL;

    variables.forEach(variable => {
      const parsedVariable = this.urlParamsParsed.find(
        item => item.name === variable,
      );

      if (!parsedVariable) return;

      const value = service.getUrlReplacementValue(parsedVariable.value!);
      url = url.replace(variable, value);
    });
    return url;
  }
}
