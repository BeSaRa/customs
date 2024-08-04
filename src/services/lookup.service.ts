import { Injectable } from '@angular/core';
import { LookupMapContract } from '@contracts/lookup-map-contract';
import { Lookup } from '@models/lookup';
import { RegisterServiceMixin } from '@mixins/register-service-mixin';
import { AdminResult } from '@models/admin-result';
import { ServiceContract } from '@contracts/service-contract';
import { isValidValue } from '@utils/utils';

@Injectable({
  providedIn: 'root',
})
export class LookupService
  extends RegisterServiceMixin(class {})
  implements ServiceContract
{
  serviceName = 'LookupService';
  lookups: LookupMapContract = {} as LookupMapContract;
  statusMap: Map<number, AdminResult> = new Map<number, AdminResult>();

  setLookups(lookups: LookupMapContract) {
    this.statusMap.clear();
    const keys = Object.keys(lookups);
    keys.forEach(key => {
      const realKey = key as keyof LookupMapContract;
      this.lookups[realKey] = lookups[realKey].map(item => {
        const lookup = new Lookup().clone(item);
        if (realKey === 'commonStatus') {
          this.statusMap.set(
            item.lookupKey,
            new AdminResult().clone<AdminResult>({ ...item }),
          );
        }
        return lookup;
      });
    });
    return this.lookups;
  }

  findLookupByLookupKey(
    lookupList: Lookup[] = [],
    lookupKey?: number,
  ): Lookup | null {
    if (!isValidValue(lookupKey) || !lookupList || lookupList.length === 0) {
      return null;
    }
    return lookupList.find(x => x.lookupKey === lookupKey) || null;
  }
}
