import { ValidationMessageContract } from '@contracts/validation-message-contract';

export const ValidationMessages: Record<string, ValidationMessageContract> = {
  required: { key: 'required_field' },
  AR_NUM: { key: 'only_arabic_letters_and_numbers' },
  ENG_NUM: { key: 'only_english_letters_and_numbers' },
};

export type ValidationMessagesType = typeof ValidationMessages;
