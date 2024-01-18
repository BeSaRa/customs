import { ClonerMixin } from '@mixins/cloner-mixin';
import { CloneContract } from '@contracts/clone-contract';
import { GetNamesMixin } from '@mixins/get-names-mixin';
import { GetNamesContract } from '@contracts/get-names-contract';

export class Lookup
  extends GetNamesMixin(ClonerMixin(class {}))
  implements CloneContract, GetNamesContract
{
  id!: number;
  category!: number;
  itemOrder!: null;
  lookupKey!: number;
  lookupStrKey?: string;
  parent?: number;
  status!: boolean;
}
