import { ClonerMixin } from '@mixins/cloner-mixin';
import { CloneContract } from '@contracts/clone-contract';
import { GetNamesMixin } from '@mixins/get-names-mixin';
import { GetNamesContract } from '@contracts/get-names-contract';
import { INames } from '@constants/app-names';

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
  
  getName() {
    let lanName = this.getLangService().getCurrent().code + 'Name'
    return this[lanName as keyof INames];
  }

}
