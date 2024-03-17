import { Component, computed, inject, signal } from '@angular/core';
import { IconButtonComponent } from '@standalone/components/icon-button/icon-button.component';
import { MAT_DIALOG_DATA, MatDialogClose } from '@angular/material/dialog';
import { ButtonComponent } from '@standalone/components/button/button.component';
import { Observable } from 'rxjs';
import { CallRequestService } from '@services/call-request.service';
import { CrudDialogDataContract } from '@contracts/crud-dialog-data-contract';
import { Offender } from '@models/offender';
import { Witness } from '@models/witness';
import { AdminDialogComponent } from '@abstracts/admin-dialog-component';
import { CallRequest } from '@models/call-request';
import { ReactiveFormsModule, UntypedFormGroup } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { DialogService } from '@services/dialog.service';
import { InvestigationCategory } from '@enums/investigation-category';
import { SummonType } from '@enums/summon-type';
import { InputComponent } from '@standalone/components/input/input.component';
import { SelectInputComponent } from '@standalone/components/select-input/select-input.component';
import { TextareaComponent } from '@standalone/components/textarea/textarea.component';
import { generateTimeList } from '@utils/utils';
import {
  MatDatepicker,
  MatDatepickerInput,
} from '@angular/material/datepicker';
import { ControlDirective } from '@standalone/directives/control.directive';
import { OperationType } from '@enums/operation-type';
import { CallRequestStatus } from '@enums/call-request-status';

@Component({
  selector: 'app-call-request-popup',
  standalone: true,
  imports: [
    IconButtonComponent,
    MatDialogClose,
    ButtonComponent,
    InputComponent,
    SelectInputComponent,
    TextareaComponent,
    ReactiveFormsModule,
    MatDatepickerInput,
    MatDatepicker,
    ControlDirective,
  ],
  templateUrl: './call-request-popup.component.html',
  styleUrl: './call-request-popup.component.scss',
  providers: [DatePipe],
})
export class CallRequestPopupComponent extends AdminDialogComponent<CallRequest> {
  override form!: UntypedFormGroup;
  callRequestService = inject(CallRequestService);
  data = inject<
    CrudDialogDataContract<
      CallRequest,
      {
        offender?: Offender;
        witness?: Witness;
        caseId: string;
      }
    >
  >(MAT_DIALOG_DATA);

  datePipe = inject(DatePipe);
  dialog = inject(DialogService);
  offender = signal(this.data.extras!.offender);
  witness = signal(this.data.extras!.witness);
  isOffender = signal(!!this.offender());
  isWitness = signal(!!this.witness());
  category = computed(() =>
    this.isOffender()
      ? InvestigationCategory.INVESTIGATION_RECORD
      : InvestigationCategory.HEARING_TRANSCRIPT,
  );
  summonedType = computed(() =>
    this.isOffender() ? SummonType.OFFENDER : SummonType.WITNESS,
  );
  personId = computed(() => {
    return this.isOffender() ? this.offender()!.id : this.witness()!.id;
  });

  person = computed(() => {
    return this.isOffender() ? this.offender() : this.witness();
  });

  times = generateTimeList();

  override _buildForm(): void {
    this.form = this.fb.group(this.model.buildForm(true));
  }

  protected override _beforeSave(): boolean | Observable<boolean> {
    return this.form.valid;
  }

  protected override _prepareModel(): CallRequest | Observable<CallRequest> {
    return new CallRequest().clone<CallRequest>({
      ...this.model,
      ...this.form.getRawValue(),
      caseId: this.data.extras?.caseId,
      summonedType: this.summonedType(),
      summonedId: this.personId(),
      status: this.inCreateMode()
        ? CallRequestStatus.UNDER_PROCEDURE
        : this.model.status,
    });
  }

  protected override _afterSave(model: CallRequest): void {
    this.model = model;
    this.operation = OperationType.UPDATE;
    this.toast.success(
      this.lang.map.msg_save_x_success.change({
        x: this.lang.map.call_request,
      }),
    );
  }
}
