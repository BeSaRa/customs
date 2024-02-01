import { DialogType } from '@enums/dialog-type';
import { LangKeysContract } from '@contracts/lang-keys-contract';

export interface DefaultDialogDataContract<T> {
  content: T;
  type: DialogType;
  title?: string;
  buttons?: {
    yes: string | keyof LangKeysContract;
    no: string | LangKeysContract;
  };
}
