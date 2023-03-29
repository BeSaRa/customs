import { ClonerMixin } from '@mixins/cloner-mixin';
import { LangMixin } from '@mixins/lang-mixin';
import { CloneContract } from '@contracts/clone-contract';
import { GetNamesContract } from '@contracts/get-names-contract';

export class AdminResult
  extends LangMixin(ClonerMixin(class {}))
  implements CloneContract, GetNamesContract
{
  id!: number;
  fnId!: string;
  parent!: number;
}
