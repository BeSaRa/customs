import { CustomMenuInterceptor } from '@model-interceptors/custom-menu-interceptor';
import { InterceptModel } from 'cast-response';
import { CustomMenuService } from '@services/custom-menu.service';
import { BaseModel } from '@abstracts/base-model';
import { StatusTypes } from '@enums/status-types';
import { AdminResult } from '@models/admin-result';
import { MenuItemContract } from '@contracts/menu-item-contract';
import { MenuUrlValueContract } from '@contracts/menu-url-value-contract';
import { CustomValidators } from '@validators/custom-validators';

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
  urlParams: string = '';
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
      userType,
      parentMenuItemId,
      icon,
      systemMenuKey,
    } = this;
    return {
      arName: controls
        ? [
            arName,
            [
              CustomValidators.required,
              CustomValidators.pattern('AR_NUM_ONE_AR'),
            ],
          ]
        : arName,
      enName: controls
        ? [
            enName,
            [
              CustomValidators.required,
              CustomValidators.pattern('ENG_NUM_ONE_ENG'),
            ],
          ]
        : enName,
      menuOrder: controls
        ? [menuOrder, [CustomValidators.required, CustomValidators.number]]
        : menuOrder,
      menuType: controls ? [menuType, [CustomValidators.required]] : menuType,
      menuView: controls ? [menuView, []] : menuView,
      userType: controls ? [userType, [CustomValidators.required]] : userType,
      icon: controls ? [icon, [CustomValidators.required]] : icon,
      parentMenuItemId: controls ? [parentMenuItemId, []] : parentMenuItemId,
      systemMenuKey: controls ? [systemMenuKey, []] : systemMenuKey,
    };
  }

  buildMenuUrlForm(controls?: boolean) {
    const { menuURL } = this;
    return {
      menuURL: controls
        ? [menuURL, [CustomValidators.maxLength(350)]]
        : menuURL,
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

  static clone(data: Partial<CustomMenu>): CustomMenu {
    const instance = new CustomMenu();
    Object.assign(instance, data);
    return instance;
  }
}
