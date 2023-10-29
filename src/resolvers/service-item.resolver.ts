import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from '@angular/router';
import { INavigatedItem } from '@contracts/inavigated-item';
import { UserInboxService } from '@services/user-inbox.services';
import { iif, Observable, of, switchMap, map } from 'rxjs';
import { OpenFrom } from '@enums/open-from';
import { OpenedInfoContract } from '@contracts/opened-info-contract';
import { ConfigService } from '@services/config.service';
import { BaseCase } from '@models/base-case';

export class ServiceItemResolver {
  private static data: {
    itemKey: string;
    route: ActivatedRouteSnapshot;
    info?: INavigatedItem;
    userInboxService: UserInboxService;
    configService: ConfigService;
  } = {} as any;

  private static _init(route: ActivatedRouteSnapshot): void {
    this.data.userInboxService = inject(UserInboxService);
    this.data.configService = inject(ConfigService);

    this.data.itemKey = this.data.configService.CONFIG.E_SERVICE_ITEM_KEY;
    this.data.route = route;
  }

  static resolve: ResolveFn<OpenedInfoContract | null> = (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<OpenedInfoContract | null> => {
    this._init(route);
    const item = this.getItem();
    if (item === null) {
      return of(null);
    }
    // decrypt information
    try {
      this.data.info = JSON.parse(item);
    } catch (e) {
      // if there is error in decryption return null
      console.log('error in decryption');
      return of(null);
    }
    const { caseId, caseType, openFrom, taskId } = this.data.info as INavigatedItem;
    if (!caseId || !caseType) {
      // if we have missing needed properties while decrypt the info return null
      console.log('missing info');
      return of(null);
    }
    const service = this.data.userInboxService.getService(caseType);
    return of(openFrom)
      .pipe(
        switchMap(() =>
          iif(
            () => openFrom === OpenFrom.SEARCH,
            service.getDetails(caseId),
            service.getDetails(caseId)
      // service.getTask(taskId!)
      )))
      .pipe(
        map((model: BaseCase<any, any>) => {
          return { model, ...this.data.info } as OpenedInfoContract;
        })
      );
  };

  static getItem(): string | null {
    return this.data.route.queryParamMap.get(this.data.itemKey);
  }
}
