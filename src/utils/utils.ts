import { FormControlDirective, FormControlName, NgModel } from '@angular/forms';

export function isNgModel(control: unknown): control is NgModel {
  return control instanceof NgModel;
}

export function isFormControlDirective(
  control: unknown
): control is FormControlDirective {
  return control instanceof FormControlDirective;
}

export function isFormControlName(
  control: unknown
): control is FormControlName {
  return control instanceof FormControlName;
}
