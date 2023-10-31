import { DialogRef } from '@angular/cdk/dialog';
import { Component, OnInit, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { DialogService } from '@services/dialog.service';
import { LangService } from '@services/lang.service';
import { ButtonComponent } from '@standalone/components/button/button.component';
import { IconButtonComponent } from '@standalone/components/icon-button/icon-button.component';
import { InputComponent } from '@standalone/components/input/input.component';
import { CustomValidators } from '@validators/custom-validators';

@Component({
  selector: 'app-violation-repeate-popup',
  standalone: true,
  imports: [InputComponent, ButtonComponent, MatDialogModule, IconButtonComponent, ReactiveFormsModule],
  templateUrl: './violation-repeate-popup.component.html',
  styleUrls: ['./violation-repeate-popup.component.scss'],
})
export class ViolationRepeatePopupComponent implements OnInit {
  inputMaskPatterns = CustomValidators.inputMaskPatterns;
  lang = inject(LangService);
  dialog = inject(DialogService);
  control = new FormControl(null, [CustomValidators.required, CustomValidators.number, Validators.min(1)]);
  matDialogRef = inject(MatDialogRef);
  constructor() { }

  ngOnInit() { }

  next() {
    if (this.control.valid) {
      this.matDialogRef.close(this.control.value);
    } else {
      this.dialog.warning(this.lang.map.msg_make_sure_all_required_fields_are_filled);
    }
  }
}
