import { Component, inject, OnInit } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogClose,
  MatDialogRef,
} from '@angular/material/dialog';
import { ButtonComponent } from '@standalone/components/button/button.component';
import { ControlDirective } from '@standalone/directives/control.directive';
import { IconButtonComponent } from '@standalone/components/icon-button/icon-button.component';
import { InputComponent } from '@standalone/components/input/input.component';
import { MatDatepicker } from '@angular/material/datepicker';
import { LangService } from '@services/lang.service';
import { filter, Subject, switchMap, tap } from 'rxjs';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { CustomValidators } from '@validators/custom-validators';
import { DialogService } from '@services/dialog.service';
import { OfflinePaymentService } from '@services/offline-payment.service';
import { Fine } from '@models/Fine';

@Component({
  selector: 'app-add-payment-popup',
  standalone: true,
  imports: [
    ButtonComponent,
    ControlDirective,
    IconButtonComponent,
    InputComponent,
    MatDatepicker,
    ReactiveFormsModule,
    MatDialogClose,
  ],
  templateUrl: './add-payment-popup.component.html',
  styleUrl: './add-payment-popup.component.scss',
})
export class AddPaymentPopupComponent implements OnInit {
  lang = inject(LangService);
  data = inject(MAT_DIALOG_DATA);
  dialogRef = inject(MatDialogRef);
  dialog = inject(DialogService);
  offlinePaymentService = inject(OfflinePaymentService);
  fine: Fine = this.data.fine;
  save$: Subject<void> = new Subject<void>();
  control = new FormControl('', [
    CustomValidators.required,
    CustomValidators.pattern('TRANSACTION_NUMBER'),
  ]);
  ngOnInit(): void {
    this.listenToSave();
  }
  listenToSave() {
    this.save$
      .pipe(
        tap(
          () =>
            this.control.invalid &&
            this.dialog.error(
              this.lang.map.msg_make_sure_all_required_fields_are_filled,
            ),
        ),
        filter(() => this.control.valid),
      )
      .pipe(
        switchMap(() => {
          return this.offlinePaymentService.pay({
            offenderId: this.fine.offenderId,
            penaltyDecisionNumber: this.fine.penaltyDecisionNumber,
            transactionNumber: this.control.value as string,
          });
        }),
      )
      .subscribe(() => this.dialogRef.close());
  }
}
