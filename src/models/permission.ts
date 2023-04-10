import { ClonerMixin } from '@mixins/cloner-mixin';
import { GetNamesMixin } from '@mixins/get-names-mixin';
import { GetNamesContract } from '@contracts/get-names-contract';
import { CloneContract } from '@contracts/clone-contract';
import { AppPermissionsType } from '@constants/app-permissions';

export class Permission
  extends GetNamesMixin(ClonerMixin(class {}))
  implements GetNamesContract, CloneContract
{
  id!: number;
  override arName!: string;
  override enName!: string;
  permissionKey!: keyof AppPermissionsType;
  permissionGroup!: string;
  category!: string;
}
