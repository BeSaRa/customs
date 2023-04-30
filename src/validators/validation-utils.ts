/* eslint-disable no-control-regex,no-useless-escape */
import {
  AbstractControl,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { ValidationReturnType } from '@app-types/validation-return-type';
import { hasValidLength, isValidValue } from '@utils/utils';
import { LangKeysContract } from '@contracts/lang-keys-contract';
// noinspection RegExpDuplicateCharacterInClass
export const validationPatterns = {
  ENG_NUM: new RegExp(/^[a-zA-Z0-9\- ]+$/),
  AR_NUM: new RegExp(/^[\u0621-\u064A0-9\u0660-\u0669\- ]+$/),
  ENG_ONLY: new RegExp(/^[a-zA-Z ]+$/),
  AR_ONLY: new RegExp(/^[\u0621-\u064A ]+$/),
  ENG_NUM_ONLY: new RegExp(/^[a-zA-Z0-9]+$/),
  AR_NUM_ONLY: new RegExp(/^[\u0621-\u064A0-9\u0660-\u0669]+$/),
  ENG_NUM_ONE_ENG: new RegExp(/^(?=.*[a-zA-Z])([a-zA-Z0-9\- ]+)$/),
  AR_NUM_ONE_AR: new RegExp(
    /^(?=.*[\u0621-\u064A])([\u0621-\u064A0-9\u0660-\u0669\- ]+)$/
  ),
  ENG_AR_ONLY: new RegExp(/^[a-zA-Z\u0621-\u064A ]+$/),
  ENG_AR_NUM_ONLY: new RegExp(/^[a-zA-Z\u0621-\u064A0-9\u0660-\u0669 ]+$/),
  ENG_NO_SPACES_ONLY: new RegExp(/^[a-zA-Z]+$/),
  PASSPORT: new RegExp('^[A-Z][0-9]{8,}$'),
  EMAIL: new RegExp(
    /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)])/
  ),
  NUM_HYPHEN_COMMA: new RegExp('^(?=.*?[1-9])[0-9-,._]+$'),
  // PHONE_NUMBER: new RegExp('^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$','gmi')
  PHONE_NUMBER: new RegExp(/^[+]?[0-9]+$/),
  // WEBSITE: new RegExp('^(?!mailto:)(?:(?:http|https|ftp)://)(?:\\S+(?::\\S*)?@)?(?:(?:(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}(?:\\.(?:[0-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))|(?:(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)(?:\\.(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)*(?:\\.(?:[a-z\\u00a1-\\uffff]{2,})))|localhost)(?::\\d{2,5})?(?:(/|\\?|#)[^\\s]*)?$', 'ig'),
  WEBSITE: new RegExp(
    /[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/,
    'ig'
  ), // TODO!: wrong regex
  URL: new RegExp('http(s)?://(www.)?[-a-zA-Z0-9@:%._+~#=]{1,256}', 'ig'),
  HAS_LETTERS: new RegExp(
    /^[\u0621-\u064A0-9\u0660-\u0669\u0621-\u064Aa-zA-Z0-9]*[\u0621-\u064Aa-zA-Z ]/
  ),
};

export type ValidationPatternType = typeof validationPatterns;

export function validateFieldsStatus(fields: string[]): ValidatorFn {
  return (formGroup: AbstractControl): ValidationReturnType => {
    const isInvalid = fields.some((fieldName: string) => {
      return formGroup.get(fieldName)?.invalid;
    });
    return isInvalid ? { required: true } : null;
  };
}

export function validateSum(
  expectedSum: number,
  numberOfPlaces: number,
  fields: string[],
  fieldLocalizationMap: (keyof LangKeysContract)[]
): ValidatorFn {
  return (formGroup: AbstractControl): ValidationReturnType => {
    let sum = 0;
    fields.map((fieldName: string) => {
      const control = formGroup.get(fieldName);
      let value = control?.value || 0;
      if (value && isValidValue(value) && !isNaN(value)) {
        value =
          numberOfPlaces === 0
            ? Number(value)
            : Number(Number(value).toFixed(numberOfPlaces));
      }
      sum += value;
      return fieldName;
    });
    sum = numberOfPlaces === 0 ? sum : Number(sum.toFixed(numberOfPlaces));
    expectedSum =
      numberOfPlaces === 0
        ? expectedSum
        : Number(expectedSum.toFixed(numberOfPlaces));
    return expectedSum === sum
      ? null
      : { invalid_sum_total: { fields, fieldLocalizationMap, expectedSum } };
  };
}

export function numberValidator(
  control: AbstractControl
): ValidationErrors | null {
  if (!control.value) {
    return null;
  }
  const isValid = /^[0-9\u0660-\u0669]+$/g.test(control.value);
  return !isValid ? { number: true } : null;
}

export function decimalValidator(numberOfPlaces = 2): ValidatorFn {
  // , allowNegative: boolean = false
  if (!isValidValue(numberOfPlaces)) {
    return Validators.nullValidator;
  }
  return (control: AbstractControl): ValidationErrors | null => {
    if (!isValidValue(control.value)) {
      return null;
    }
    // eslint-disable-next-line no-useless-escape
    const decimalPattern = `^([0-9\u0660-\u0669]*)(\.[0-9\u0660-\u0669]{1,${numberOfPlaces}})?$`;
    const isValid = new RegExp(decimalPattern).test(control.value);
    return isValid ? null : { decimal: { numberOfPlaces: numberOfPlaces } };
  };
}

function getValueLength(control: AbstractControl): number {
  return typeof control.value !== 'undefined' || control.value !== null
    ? ('' + control.value).length
    : 0;
}

export function maxlengthValidator(maxLength: number): ValidatorFn {
  if (maxLength === 0 || !isValidValue(maxLength)) {
    return Validators.nullValidator;
  }
  return (control: AbstractControl): ValidationErrors | null => {
    if (!isValidValue(control.value) || !hasValidLength(control.value)) {
      return null;
    }
    const valueLength = getValueLength(control);
    return valueLength > maxLength
      ? { maxlength: { requiredLength: maxLength, actualLength: valueLength } }
      : null;
  };
}

export function minlengthValidator(minLength: number): ValidatorFn {
  if (!isValidValue(minLength)) {
    return Validators.nullValidator;
  }
  return (control: AbstractControl): ValidationErrors | null => {
    if (!isValidValue(control.value) || !hasValidLength(control.value)) {
      return null;
    }
    const valueLength = getValueLength(control);
    return getValueLength(control) < minLength
      ? { minlength: { requiredLength: minLength, actualLength: valueLength } }
      : null;
  };
}

export function requiredValidator(
  control: AbstractControl
): ValidationErrors | null {
  return !isValidValue(control.value) ? { required: true } : null;
}

export function requiredArrayValidator(
  control: AbstractControl
): ValidationErrors | null {
  return !isValidValue(control.value) || control.value.length === 0
    ? { requiredArray: true }
    : null;
}

export function patternValidator(
  patternName: keyof ValidationPatternType
): ValidatorFn {
  if (
    !patternName ||
    !Object.prototype.hasOwnProperty.call(validationPatterns, patternName)
  ) {
    return Validators.nullValidator;
  }

  return (control: AbstractControl): ValidationErrors | null => {
    if (!isValidValue(control.value)) {
      return null;
    }
    const response: Record<keyof ValidationPatternType, boolean> = {} as Record<
      keyof ValidationPatternType,
      boolean
    >;
    response[patternName] = true;
    return !validationPatterns[patternName].test(control.value)
      ? response
      : null;
  };
}

export function uniqueValidator<T>(
  data: T[],
  property: keyof T,
  editObj: T
): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null;
    }

    const unique = data.some(function (row) {
      if (editObj) {
        return (
          (editObj[property] + '').toLowerCase() !==
            (row[property] + '').toLowerCase() &&
          (row[property] + '').toLowerCase() === control.value.toLowerCase()
        );
      }
      return (row[property] + '').toLowerCase() === control.value.toLowerCase();
    });
    return unique ? { unique: { value: control.value } } : null;
  };
}

export function anyFieldsHasLength(fields: string[]): ValidatorFn {
  return (control): ValidationErrors | null => {
    const valid = fields.some((field) => {
      const value = control.get(field)?.value;
      return value ? value.trim().length : false;
    });
    return valid ? null : { atLeastOneRequired: fields };
  };
}
