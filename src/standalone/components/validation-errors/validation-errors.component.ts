import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Input,
} from '@angular/core';

import { ValidationErrors } from '@angular/forms';
import {
  ValidationMessages,
  ValidationMessagesType,
} from '@constants/validation-messages';
import { LangService } from '@services/lang.service';
import { LangKeysContract } from '@contracts/lang-keys-contract';

@Component({
  selector: 'app-validation-errors',
  standalone: true,
  imports: [],
  templateUrl: './validation-errors.component.html',
  styleUrls: ['./validation-errors.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ValidationErrorsComponent {
  lang = inject(LangService);
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
    const validationReplace = currentNewError[1];
    const validation = ValidationMessages[validationKey];
    if (!validation) {
      this.currentError = `Error: key not exists (${validationKey}) in ValidationMessages`;
      return;
    }
    // this.currentError = validation.replace ? validation.replace(validation.key) : identity(validation.key);
    const languageKey = validation.key as keyof LangKeysContract;
    this.currentError = this.lang.map[languageKey];
    if (validation.replace) {
      this.currentError = validation.replace(
        this.currentError,
        validationReplace,
      );
    }
  }
}
