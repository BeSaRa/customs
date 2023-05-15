import { Injectable } from '@angular/core';
import { LookupMapContract } from '@contracts/lookup-map-contract';
import { Lookup } from '@models/lookup';

@Injectable({
  providedIn: 'root',
})
export class LookupService {
  lookups: LookupMapContract = {} as LookupMapContract;

  setLookups(lookups: LookupMapContract) {
    const keys = Object.keys(lookups);
    keys.forEach((key) => {
      const realKey = key as keyof LookupMapContract;
      this.lookups[realKey] = lookups[realKey].map((item) =>
        new Lookup().clone(item)
      );
    });
    return this.lookups;
  }
}
