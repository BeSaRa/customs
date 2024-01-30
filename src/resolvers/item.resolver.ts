import { ActivatedRouteSnapshot, ResolveFn } from '@angular/router';
import { inject } from '@angular/core';
import { EncryptionService } from '@services/encryption.service';
import { InboxService } from '@services/inbox.services';
import { ConfigService } from '@services/config.service';
import { INavigatedItem } from '@contracts/inavigated-item';
import { iif, map, of, switchMap } from 'rxjs';
import { OpenedInfoContract } from '@contracts/opened-info-contract';
import { OpenFrom } from '@enums/open-from';

export const itemResolver: ResolveFn<OpenedInfoContract | null> = route => {
  const userInboxService = inject(InboxService);
  const configService = inject(ConfigService);
  const encryptionService = inject(EncryptionService);
  const itemKey = configService.CONFIG.E_SERVICE_ITEM_KEY;
  const item = getItem(route, itemKey);
  let info: INavigatedItem;
  if (!item) {
    return of(null);
  } else {
    try {
      info = encryptionService.decrypt<INavigatedItem>(item);
    } catch (e) {
      // if there is error in decryption return null
      console.log('error in decryption');
      return of(null);
    }
    const { caseId, caseType, openFrom, taskId } = info;
    if (!caseId || !caseType) {
      // if we have missing needed properties while decrypt the info return null
      console.log('missing info');
      return of(null);
    }
    const service = userInboxService.getService(caseType);
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
          return { model, ...info } as unknown as OpenedInfoContract;
        }),
      );
  }
};

function getItem(route: ActivatedRouteSnapshot, key: string): string | null {
  return route.queryParamMap.get(key);
}
