import { Cloner } from '@abstracts/cloner';

export class Lookup extends Cloner {
  id!: number;
  arName!: string;
  category!: number;
  enName!: string;
  itemOrder!: null;
  lookupKey!: number;
  lookupStrKey?: string;
  parent?: number;
  status!: boolean;
}
