import {
  anyFieldsHasLength,
  decimalValidator,
  maxlengthValidator,
  minlengthValidator,
  numberValidator,
  patternValidator,
  requiredArrayValidator,
  requiredValidator,
  uniqueValidator,
  validateFieldsStatus,
  validateSum,
} from '@validators/validation-utils';

export const CustomValidators = {
  validateFieldsStatus: validateFieldsStatus,
  validateSum: validateSum,
  required: requiredValidator,
  requiredArray: requiredArrayValidator,
  pattern: patternValidator,
  number: numberValidator,
  decimal: decimalValidator,
  minLength: minlengthValidator,
  maxLength: maxlengthValidator,
  anyFieldsHasLength,
  unique: uniqueValidator,
};
