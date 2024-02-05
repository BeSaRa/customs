import { LookupMapContract } from '@contracts/lookup-map-contract';
import { Localization } from '@models/localization';
import { GlobalSetting } from '@models/global-setting';

export interface InfoContract {
  localizationSet: Localization[];
  lookupMap: LookupMapContract;
  globalSetting: GlobalSetting;
}
