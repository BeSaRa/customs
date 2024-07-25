import { Lookup } from '@models/lookup';

export interface MenuUrlValueContract {
  name: string;
  value?: number;
  valueLookups: Lookup[];
}
