import {
  anyFieldsHasLength,
  decimalValidator,
  maxLengthValidator,
  minlengthValidator,
  numberValidator,
  patternValidator,
  requiredArrayValidator,
  requiredValidator,
  uniqueValidator,
  validateFieldsStatus,
  validateSum,
  positiveNumberValidator,
  inputMaskPatterns,
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
  maxLength: maxLengthValidator,
  anyFieldsHasLength,
  unique: uniqueValidator,
  positiveNumber: positiveNumberValidator,
  inputMaskPatterns,
};
