import { LookupMapContract } from '@contracts/lookup-map-contract';
import { Localization } from '@models/localization';

export interface InfoContract {
  localizationSet: Localization[];
  lookupMap: LookupMapContract;
}
