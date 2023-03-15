import { DialogType } from '@enums/dialog-type';

export interface DefaultDialogDataContract<T> {
  content: T;
  type: DialogType;
  title?: string;
  buttons?: { yes: string; no: string };
}
