import { ValidationMessageContract } from '@contracts/validation-message-contract';

export const ValidationMessages: Record<string, ValidationMessageContract> = {
  required: { key: 'required_field' },
  AR_NUM: { key: 'only_arabic_letters_and_numbers' },
  ENG_NUM: { key: 'only_english_letters_and_numbers' },
  AR_ONLY: { key: 'only_arabic_letters' },
  ENG_ONLY: { key: 'only_english_letters' },
  positiveNumber: { key: 'only_positive_number' },
  number: { key: 'only_numbers' },
  minTime: { key: 'min_time' },
  ENG_NUM_ONLY: { key: 'only_english_numbers' },
  EMAIL: { key: 'email_format' },
  EMAIL_WITH_CAPITAL_LETTERS: { key: 'email_format' },
  min: {
    key: 'minimum_valid_number_is_x',
    replace: (message: string, errorValue: { min: number }) =>
      message.change({ x: errorValue.min }),
  },
  max: {
    key: 'maximum_valid_number_is_x',
    replace: (message: string, errorValue: { max: number }) =>
      message.change({ x: errorValue.max }),
  },
  maxLength: {
    key: 'maxlength_valid_is_x',
    replace: (message: string, errorValue: { requiredLength: number }) =>
      message.change({ x: errorValue.requiredLength }),
  },
  TRANSACTION_NUMBER: {
    key: 'transaction_number_pattern_error_msg',
  },
};

export type ValidationMessagesType = typeof ValidationMessages;
