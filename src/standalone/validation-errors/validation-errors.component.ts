import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ValidationErrors } from '@angular/forms';
import {
  ValidationMessages,
  ValidationMessagesType,
} from '@constants/validation-messages';
import { identity } from 'rxjs';

@Component({
  selector: 'app-validation-errors',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './validation-errors.component.html',
  styleUrls: ['./validation-errors.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ValidationErrorsComponent {
  private _errors: ValidationErrors | null | undefined;
  set errors(errors: ValidationErrors | null | undefined) {
    this.getCurrentError(errors);
    this._errors = errors;
  }

  @Input()
  get errors(): ValidationErrors | null | undefined {
    return this._errors;
  }

  currentError?: string = '';

  private getCurrentError(errors: ValidationErrors | null | undefined): void {
    if (!errors) {
      this.currentError = '';
      return;
    }
    let currentNewError;
    for (const error of Object.entries(errors)) {
      currentNewError = error;
      if (currentNewError) break;
    }
    if (!currentNewError) {
      return;
    }

    const validationKey = currentNewError[0] as keyof ValidationMessagesType;

    const validation = ValidationMessages[validationKey];
    if (!validation) {
      this.currentError = `Error: key not exists (${validationKey}) in ValidationMessages`;
      return;
    }
    this.currentError = validation.replace
      ? validation.replace(validation.key)
      : identity(validation.key);
  }
}
