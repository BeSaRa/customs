import { LookupMapContract } from '@contracts/lookup-map-contract';
import { Localization } from '@models/localization';
import { GlobalSetting } from '@models/global-setting';
import { Penalty } from '@models/penalty';

export interface InfoContract {
  localizationSet: Localization[];
  lookupMap: LookupMapContract;
  globalSetting: GlobalSetting;
  systemPenalties: Penalty[];
}
