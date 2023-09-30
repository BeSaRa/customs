import { LangCodes } from '@enums/lang-codes';

export interface LangContract {
  id: number;
  name: string;
  code: LangCodes;
  direction: 'rtl' | 'ltr';
  toggleTo: LangCodes;
}
