import {
  Component,
  computed,
  EventEmitter,
  inject,
  InputSignal,
  OnInit,
} from '@angular/core';
import { ButtonComponent } from '@standalone/components/button/button.component';
import { IconButtonComponent } from '@standalone/components/icon-button/icon-button.component';
import { InputComponent } from '@standalone/components/input/input.component';
import { MAT_DIALOG_DATA, MatDialogClose } from '@angular/material/dialog';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { SwitchComponent } from '@standalone/components/switch/switch.component';
import { LangService } from '@services/lang.service';
import { Subject, switchMap, tap } from 'rxjs';
import { TextareaComponent } from '@standalone/components/textarea/textarea.component';
import { Offender } from '@models/offender';
import { Investigation } from '@models/investigation';
import { SystemPenalties } from '@enums/system-penalties';
import { CustomValidators } from '@validators/custom-validators';
import { filter, map } from 'rxjs/operators';
import { DialogService } from '@services/dialog.service';
import { Penalty } from '@models/penalty';
import { PenaltyDecision } from '@models/penalty-decision';
import { EmployeeService } from '@services/employee.service';
import { DialogRef } from '@angular/cdk/dialog';
import { ToastService } from '@services/toast.service';

@Component({
  selector: 'app-terminate-popup',
  standalone: true,
  imports: [
    ButtonComponent,
    IconButtonComponent,
    InputComponent,
    MatDialogClose,
    ReactiveFormsModule,
    SwitchComponent,
    TextareaComponent,
  ],
  templateUrl: './terminate-popup.component.html',
  styleUrl: './terminate-popup.component.scss',
})
export class TerminatePopupComponent implements OnInit {
  data = inject<{
    offender: Offender;
    model: InputSignal<Investigation>;
    updateModel: InputSignal<EventEmitter<void>>;
    selectedPenalty: Penalty;
  }>(MAT_DIALOG_DATA);
  dialogRef = inject(DialogRef);
  toast = inject(ToastService);
  lang = inject(LangService);
  employeeService = inject(EmployeeService);
  save$ = new Subject<void>();
  offender = this.data.offender;
  model = this.data.model;
  updateModel = this.data.updateModel;
  oldPenalty = computed(() => {
    return this.model().getPenaltyDecisionByOffenderId(this.offender.id);
  });
  samePenalty = computed(() => {
    return (
      this.oldPenalty()?.penaltyInfo.penaltyKey === SystemPenalties.TERMINATE
    );
  });
  selectedPenalty = this.data.selectedPenalty;

  control = new FormControl(
    this.samePenalty() ? this.oldPenalty()?.comment : '',
    { nonNullable: true, validators: [CustomValidators.required] },
  );

  dialog = inject(DialogService);

  ngOnInit(): void {
    this.listenToSave();
  }

  private listenToSave() {
    this.save$
      .pipe(
        map(() => {
          return this.control.valid;
        }),
        tap(isValid => {
          !isValid &&
            this.dialog.error(
              this.lang.map.msg_make_sure_all_required_fields_are_filled,
            );
        }),
        filter(isValid => isValid),
        map(() => {
          return new PenaltyDecision().clone<PenaltyDecision>({
            ...this.oldPenalty(),
            caseId: this.model().id,
            penaltyId: this.selectedPenalty.id,
            penaltyInfo: this.selectedPenalty,
            signerId: this.employeeService.getEmployee()!.id!,
            status: 1,
            comment: this.control.value,
            offenderId: this.offender.id,
          });
        }),
        switchMap(model => {
          return model.save().pipe(
            map(item =>
              model.clone<PenaltyDecision>({
                id: item.id,
              }),
            ),
          );
        }),
      )
      .subscribe(model => {
        model && this.model().appendPenaltyDecision(model);
        this.toast.success(this.lang.map.the_penalty_saved_successfully);
        this.updateModel().emit();
        this.dialogRef.close();
      });
  }
}
