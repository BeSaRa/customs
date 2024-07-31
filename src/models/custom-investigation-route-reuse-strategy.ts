import {
  ActivatedRouteSnapshot,
  BaseRouteReuseStrategy,
} from '@angular/router';

export class CustomInvestigationRouteReuseStrategy extends BaseRouteReuseStrategy {
  static shouldReload(
    from: ActivatedRouteSnapshot,
    to: ActivatedRouteSnapshot,
  ): boolean {
    return (
      (to.queryParamMap.get('reload') && !from.queryParamMap.get('reload')) ||
      (!!from.queryParamMap.get('item') &&
        to.queryParamMap.get('item') !== from.queryParamMap.get('item'))
    );
  }

  override shouldReuseRoute(
    future: ActivatedRouteSnapshot,
    curr: ActivatedRouteSnapshot,
  ): boolean {
    if (CustomInvestigationRouteReuseStrategy.shouldReload(curr, future)) {
      return false;
    } else return future.routeConfig === curr.routeConfig;
  }
}
