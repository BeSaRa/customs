import { ClonerMixin } from '@mixins/cloner-mixin';
import { CloneContract } from '@contracts/clone-contract';

export class Lookup extends ClonerMixin(class {}) implements CloneContract {
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
