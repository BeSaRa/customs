import { Component, HostListener, inject, OnInit } from '@angular/core';
import {
  FormControl,
  ReactiveFormsModule,
  UntypedFormControl,
} from '@angular/forms';
import { MatDialogClose, MatDialogRef } from '@angular/material/dialog';
import { DialogService } from '@services/dialog.service';
import { LangService } from '@services/lang.service';
import { ButtonComponent } from '@standalone/components/button/button.component';
import { AllowRegexPattern } from '@standalone/directives/allow-regex-pattern.directive';
import { ControlDirective } from '@standalone/directives/control.directive';
import { validationPatterns } from '@validators/validation-utils';
import { Subject } from 'rxjs';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-verify-popup',
  standalone: true,
  imports: [
    ButtonComponent,
    MatDialogClose,
    ReactiveFormsModule,
    ControlDirective,
    AllowRegexPattern,
  ],
  templateUrl: './verify-popup.component.html',
  styleUrl: './verify-popup.component.scss',
})
export class VerifyPopupComponent implements OnInit {
  lang = inject(LangService);
  dialogRef = inject(MatDialogRef);
  dialog = inject(DialogService);
  verify$: Subject<void> = new Subject();
  control: UntypedFormControl = new FormControl('');

  readonly regex = validationPatterns.LOWER_ENG_NUM_ONLY;

  @HostListener('document:keypress', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      event.preventDefault();
      this.verify$.next();
    }
  }
  ngOnInit(): void {
    this._listenToVerify();
  }

  private _listenToVerify() {
    this.verify$.pipe(filter(() => this.isValidOTP())).subscribe(() => {
      this.dialogRef.close(this.control.value);
    });
  }

  isValidOTP() {
    return this.control.value.length === 6;
  }
}
