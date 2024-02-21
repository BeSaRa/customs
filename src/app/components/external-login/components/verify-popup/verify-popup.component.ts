import { Component, HostListener, inject, OnInit } from '@angular/core';
import { ButtonComponent } from '@standalone/components/button/button.component';
import { IconButtonComponent } from '@standalone/components/icon-button/icon-button.component';
import { InputComponent } from '@standalone/components/input/input.component';
import { MatDialogClose, MatDialogRef } from '@angular/material/dialog';
import {
  FormControl,
  ReactiveFormsModule,
  UntypedFormControl,
} from '@angular/forms';
import { LangService } from '@services/lang.service';
import { Subject } from 'rxjs';
import { filter } from 'rxjs/operators';
import { DialogService } from '@services/dialog.service';
import { inputMaskPatterns } from '@validators/validation-utils';
import { NgxMaskDirective } from 'ngx-mask';
import { ControlDirective } from '@standalone/directives/control.directive';

@Component({
  selector: 'app-verify-popup',
  standalone: true,
  imports: [
    ButtonComponent,
    IconButtonComponent,
    InputComponent,
    MatDialogClose,
    ReactiveFormsModule,
    NgxMaskDirective,
    ControlDirective,
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
  inputMaskPatterns = inputMaskPatterns;
  @HostListener('document:keypress', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.code === 'Enter') {
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
    return this.control.value.length === 4;
  }
}
