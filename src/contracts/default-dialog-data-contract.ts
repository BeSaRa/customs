import { DialogType } from '@enums/dialog-type';
import { LangKeysContract } from '@contracts/lang-keys-contract';
import { ButtonTypeContract } from '@contracts/button-type-contract';

export interface DefaultDialogDataContract<T> {
  content: T;
  type: DialogType;
  title?: string;
  buttons?: {
    yes: string | keyof LangKeysContract;
    no: string | LangKeysContract;
  };
  multiButtons?: {
    key: string | LangKeysContract;
    value: unknown;
    type?: keyof ButtonTypeContract;
  }[];
}
