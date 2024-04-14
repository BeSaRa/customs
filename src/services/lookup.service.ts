import { Injectable } from '@angular/core';
import { LookupMapContract } from '@contracts/lookup-map-contract';
import { Lookup } from '@models/lookup';
import { RegisterServiceMixin } from '@mixins/register-service-mixin';
import { AdminResult } from '@models/admin-result';
import { ServiceContract } from '@contracts/service-contract';

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
    this.lookups.calendarFormat = [
      new Lookup().clone<Lookup>({
        arName: 'يوم',
        enName: 'Day',
        lookupKey: 0,
      }),
      new Lookup().clone<Lookup>({
        arName: 'اسبوع',
        enName: 'Week',
        lookupKey: 1,
      }),
      new Lookup().clone<Lookup>({
        arName: 'اسبوع عمل',
        enName: 'Work week',
        lookupKey: 2,
      }),
      new Lookup().clone<Lookup>({
        arName: 'شهر',
        enName: 'Month',
        lookupKey: 3,
      }),
      new Lookup().clone<Lookup>({
        arName: 'سنة',
        enName: 'Year',
        lookupKey: 4,
      }),
    ];
    return this.lookups;
  }
}
