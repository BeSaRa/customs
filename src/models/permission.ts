import { ClonerMixin } from '@mixins/cloner-mixin';
import { LangMixin } from '@mixins/lang-mixin';
import { GetNamesContract } from '@contracts/get-names-contract';
import { CloneContract } from '@contracts/clone-contract';

export class Permission
  extends LangMixin(ClonerMixin(class {}))
  implements GetNamesContract, CloneContract
{
  id!: number;
  override arName!: string;
  override enName!: string;
  permissionKey!: string;
  permissionGroup!: string;
  category!: string;
}
