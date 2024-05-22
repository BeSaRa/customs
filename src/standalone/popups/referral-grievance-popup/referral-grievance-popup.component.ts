import { Component, inject, InputSignal, OnInit } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogClose,
  MatDialogRef,
} from '@angular/material/dialog';
import { LangService } from '@services/lang.service';
import { ButtonComponent } from '@standalone/components/button/button.component';
import { DatePipe } from '@angular/common';
import { IconButtonComponent } from '@standalone/components/icon-button/icon-button.component';
import { MatCell, MatCellDef } from '@angular/material/table';
import { TaskResponses } from '@enums/task-responses';
import { filter, Subject, switchMap, tap } from 'rxjs';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  UntypedFormGroup,
} from '@angular/forms';
import { Grievance } from '@models/grievance';
import { LookupService } from '@services/lookup.service';
import { SelectInputComponent } from '@standalone/components/select-input/select-input.component';
import { TextareaComponent } from '@standalone/components/textarea/textarea.component';
import { CustomValidators } from '@validators/custom-validators';
import { DialogService } from '@services/dialog.service';
import { UserClick } from '@enums/user-click';
import { ToastService } from '@services/toast.service';
import { LangKeysContract } from '@contracts/lang-keys-contract';

@Component({
  selector: 'app-referral-grievance-popup',
  standalone: true,
  imports: [
    ButtonComponent,
    DatePipe,
    IconButtonComponent,
    MatCell,
    MatCellDef,
    MatDialogClose,
    SelectInputComponent,
    TextareaComponent,
    ReactiveFormsModule,
  ],
  templateUrl: './referral-grievance-popup.component.html',
  styleUrl: './referral-grievance-popup.component.scss',
})
export class ReferralGrievancePopupComponent implements OnInit {
  data = inject(MAT_DIALOG_DATA);
  dialogRef = inject(MatDialogRef);
  lang = inject(LangService);
  lookupService = inject(LookupService);
  dialog = inject(DialogService);
  toast = inject(ToastService);
  officeRecommendations = this.lookupService.lookups.officeRecommendation;
  model = this.data.model as InputSignal<Grievance>;
  response = this.data.extras.response;
  save$: Subject<void> = new Subject<void>();
  form: FormGroup = new UntypedFormGroup({
    officeRecommendation: new FormControl(null, [CustomValidators.required]),
    comment: new FormControl('', [
      CustomValidators.required,
      CustomValidators.maxLength(1200),
    ]),
  });
  ngOnInit(): void {
    this._listenToSave();
  }
  private _listenToSave() {
    this.save$
      .pipe(
        tap(
          () =>
            this.form.invalid &&
            this.dialog.error(
              this.lang.map.msg_make_sure_all_required_fields_are_filled,
            ),
        ),
        filter(() => this.form.valid),
      )
      .pipe(
        switchMap(() => {
          return new Grievance()
            .clone<Grievance>({
              ...this.model(),
              officeRecommendation:
                this.form.getRawValue().officeRecommendation,
            })
            .save();
        }),
      )
      .pipe(
        switchMap(() => {
          return this.model()
            .getService()
            .completeTask(this.model().getTaskId()!, {
              comment: this.form.getRawValue().comment,
              selectedResponse: this.response,
            });
        }),
      )
      .subscribe(() => {
        this.toast.success(
          this.lang.map.msg_x_performed_successfully.change({
            x: this.lang.map.referral,
          }),
        );
        this.dialogRef.close(UserClick.YES);
      });
  }
  get title(): keyof LangKeysContract {
    switch (this.response) {
      case TaskResponses.REFERRAL_TO_PRESIDENT_ASSISTANT:
        return 'referral_to_presodent_assistant';
      case TaskResponses.REFERRAL_TO_PRESIDENT:
        return 'referral_to_presodent';
    }
    return 'referral';
  }
}
