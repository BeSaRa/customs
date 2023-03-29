import { ValidationMessageContract } from '@contracts/validation-message-contract';

export const ValidationMessages: Record<string, ValidationMessageContract> = {
  required: { key: 'required_field' },
};

export type ValidationMessagesType = typeof ValidationMessages;
