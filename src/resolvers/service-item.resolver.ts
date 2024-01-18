import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn } from '@angular/router';
import { INavigatedItem } from '@contracts/inavigated-item';
import { InboxService } from '@services/inbox.services';
import { iif, map, Observable, of, switchMap } from 'rxjs';
import { OpenFrom } from '@enums/open-from';
import { OpenedInfoContract } from '@contracts/opened-info-contract';
import { ConfigService } from '@services/config.service';
import { EncryptionService } from '@services/encryption.service';

export class ServiceItemResolver {
  private static data: {
    itemKey: string;
    route: ActivatedRouteSnapshot;
    info?: INavigatedItem;
    userInboxService: InboxService;
    configService: ConfigService;
    encryptionService: EncryptionService;
  } = {} as never;

  private static _init(route: ActivatedRouteSnapshot): void {
    this.data.userInboxService = inject(InboxService);
    this.data.configService = inject(ConfigService);
    this.data.encryptionService = inject(EncryptionService);

    this.data.itemKey = this.data.configService.CONFIG.E_SERVICE_ITEM_KEY;
    this.data.route = route;
  }

  static resolve: ResolveFn<OpenedInfoContract | null> = (
    route: ActivatedRouteSnapshot,
  ): Observable<OpenedInfoContract | null> => {
    this._init(route);
    const item = this.getItem();
    if (item === null) {
      return of(null);
    }
    // decrypt information
    try {
      this.data.info =
        this.data.encryptionService.decrypt<INavigatedItem>(item);
    } catch (e) {
      // if there is error in decryption return null
      console.log('error in decryption');
      return of(null);
    }
    const { caseId, caseType, openFrom, taskId } = this.data
      .info as INavigatedItem;
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
            () =>
              openFrom === OpenFrom.SEARCH || openFrom === OpenFrom.ADD_SCREEN,
            service.getDetails(caseId),
            service.getTask(taskId!),
          ),
        ),
      )
      .pipe(
        map(model => {
          return { model, ...this.data.info } as unknown as OpenedInfoContract;
        }),
      );
  };

  static getItem(): string | null {
    return this.data.route.queryParamMap.get(this.data.itemKey);
  }
}
