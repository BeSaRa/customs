import { FormGroup, ɵElement as Control } from '@angular/forms';

export type FormGroupControls<T> = FormGroup<{
  [P in keyof T]: Control<T[P], null>;
}>;
export type FormGroupControlsNonNullable<T> = FormGroup<{
  [P in keyof T]: Control<T[P], never>;
}>;
