import { LangKeysContract } from './lang-keys-contract';

export interface WidgetOptionContract {
  type: 'bgColor' | 'textColor';
  label: keyof LangKeysContract;
}
