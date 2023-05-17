import { ClonerMixin } from '@mixins/cloner-mixin';
import { GetNamesMixin } from '@mixins/get-names-mixin';
import { CloneContract } from '@contracts/clone-contract';
import { GetNamesContract } from '@contracts/get-names-contract';

export class AdminResult
  extends GetNamesMixin(ClonerMixin(class {}))
  implements CloneContract, GetNamesContract
{
  id!: number;
  fnId!: string;
  parent!: number;
  lookupKey!: number;
  
  static createInstance(model: Partial<AdminResult>): AdminResult {
    return Object.assign(new AdminResult, model);
  }
}
