import { ModelInterceptorContract } from 'cast-response';
import { CustomMenu } from '@models/custom-menu';
import { AdminResult } from '@models/admin-result';
import { isValidValue } from '@utils/utils';
import { StatusTypes } from '@enums/status-types';
import { MenuView } from '@enums/menu-view';
import { MenuUrlValueContract } from '@contracts/menu-url-value-contract';
import { inject } from '@angular/core';
import { LookupService } from '@services/lookup.service';

export class CustomMenuInterceptor
  implements ModelInterceptorContract<CustomMenu>
{
  receive(model: CustomMenu): CustomMenu {
    CustomMenuInterceptor._receive(model);
    return model;
  }

  static _receive(model: CustomMenu): CustomMenu {
    model.statusInfo &&
      (model.statusInfo = AdminResult.createInstance(model.statusInfo));
    model.menuTypeInfo &&
      (model.menuTypeInfo = AdminResult.createInstance(model.menuTypeInfo));
    model.menuViewInfo &&
      (model.menuViewInfo = AdminResult.createInstance(model.menuViewInfo));
    model.parentMenuItemInfo &&
      (model.parentMenuItemInfo = AdminResult.createInstance(
        model.parentMenuItemInfo,
      ));
    model.userTypeInfo &&
      (model.userTypeInfo = AdminResult.createInstance(model.userTypeInfo));
    if (!isValidValue(model.subMenuItems)) {
      model.subMenuItems = [];
    }
    model.subMenuItems.map(item =>
      CustomMenuInterceptor._receive(
        new CustomMenu().clone(
          item as unknown as Partial<CustomMenu>,
        ) as unknown as CustomMenu,
      ),
    );

    CustomMenuInterceptor._parseUrl(model);
    return model;
  }

  send(model: Partial<CustomMenu>): Partial<CustomMenu> {
    model.status = model.status ? StatusTypes.ACTIVE : StatusTypes.INACTIVE;
    model.menuView = model.menuView ? MenuView.PRIVATE : MenuView.PUBLIC;
    CustomMenuInterceptor._stringifyUrl(model);

    CustomMenuInterceptor._deleteBeforeSend(model);

    return model;
  }

  static _stringifyUrl(model: Partial<CustomMenu>): void {
    if (model.urlParamsParsed && model.urlParamsParsed.length > 0) {
      const urlParams = model.urlParamsParsed.map(x => {
        return { [x.name]: x.valueLookups[0].lookupKey };
      });
      model.urlParams = JSON.stringify(urlParams);
    } else {
      model.urlParams = '{}';
    }
  }

  static _parseUrl(model: CustomMenu): void {
    try {
      const lookupService = inject(LookupService);
      if (isValidValue(model.urlParams)) {
        let urlParamsParsed = JSON.parse(model.urlParams);
        urlParamsParsed = urlParamsParsed.map((x: any) => {
          const name: string = Object.keys(x)[0],
            value: number = Object.values<number>(x)[0],
            lookup = lookupService.findLookupByLookupKey(
              lookupService.lookups.menuItemParameters,
              value,
            );
          console.log(lookup);
          if (!lookup) {
            console.warn('No lookup found matching value ' + value);
          }
          return <MenuUrlValueContract>{
            name: name,
            value: lookup ? value : undefined,
            valueLookups: lookup ? [lookup] : [],
          };
        });
        model.urlParamsParsed = urlParamsParsed;
      } else {
        model.urlParamsParsed = [];
      }
    } catch (e) {
      model.urlParamsParsed = [];
    }
  }

  static _deleteBeforeSend(model: Partial<CustomMenu>): void {
    delete model.statusInfo;
    delete model.menuTypeInfo;
    delete model.menuViewInfo;
    delete model.parentMenuItemInfo;
    delete model.userTypeInfo;
    delete model.subMenuItems;
    delete model.urlParamsParsed;
    delete model.defaultParent;
    delete model.customParentId;
    delete model.hasSystemParent;
    delete model.isSystemParent;
  }
}
