import { LangKeysContract } from '@contracts/lang-keys-contract';

export interface ContextMenuActionContract<T = unknown> {
  name: string;
  type: 'divider' | 'action';
  label?: keyof LangKeysContract | ((item: T) => string);
  callback?: (item: T) => void;
  icon?: string;
  disabled?: boolean | ((item: T) => boolean);
  hide?: boolean | ((item: T) => boolean);
  parent?: string;
  children?: ContextMenuActionContract<T>[];
}
