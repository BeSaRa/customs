import { LangMixin } from '@mixins/lang-mixin';
import { GetNamesContract } from '@contracts/get-names-contract';
import { ClonerMixin } from '@mixins/cloner-mixin';
import { CloneContract } from '@contracts/clone-contract';

export class Localization
  extends ClonerMixin(LangMixin(class {}))
  implements GetNamesContract, CloneContract
{
  id!: number;
  localizationKey!: string;
  module!: number;
}
