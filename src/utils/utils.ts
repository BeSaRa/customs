import { FormControlDirective, FormControlName, NgModel } from '@angular/forms';
import { catchError, MonoTypeOperatorFunction, NEVER, Observable } from 'rxjs';

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

export function ignoreErrors<T>(debug = false): MonoTypeOperatorFunction<T> {
  return (source: Observable<T>) => {
    return source.pipe(
      catchError((error) => {
        debug && console.log(error);
        return NEVER;
      })
    );
  };
}
