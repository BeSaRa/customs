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
import { forkJoin, Subject, switchMap, tap } from 'rxjs';
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
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatNoDataRow,
  MatRow,
  MatRowDef,
  MatTable,
} from '@angular/material/table';

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
    MatTable,
    MatHeaderCell,
    MatColumnDef,
    MatHeaderCellDef,
    MatCellDef,
    MatCell,
    MatHeaderRow,
    MatRow,
    MatNoDataRow,
    MatRowDef,
    MatHeaderRowDef,
  ],
  templateUrl: './terminate-popup.component.html',
  styleUrl: './terminate-popup.component.scss',
})
export class TerminatePopupComponent implements OnInit {
  data = inject<{
    offenders: Offender[];
    model: InputSignal<Investigation>;
    updateModel: InputSignal<EventEmitter<void>>;
    selectedPenalty: Penalty;
    isSingle: boolean;
  }>(MAT_DIALOG_DATA);
  dialogRef = inject(DialogRef);
  toast = inject(ToastService);
  lang = inject(LangService);
  employeeService = inject(EmployeeService);
  save$ = new Subject<void>();
  isSingle = this.data.isSingle;
  offenders = this.data.offenders;
  offender = this.offenders[0];
  model = this.data.model;
  updateModel = this.data.updateModel;
  oldPenaltiesMap = computed(() => {
    return this.offenders
      .map(offender => {
        return this.model().getPenaltyDecisionByOffenderId(offender.id);
      })
      .filter((item): item is PenaltyDecision => !!item)
      .reduce<Record<number, PenaltyDecision>>((acc, item) => {
        return { ...acc, [item.offenderId]: item };
      }, {});
  });
  samePenalty = computed(() => {
    return (
      this.isSingle &&
      this.oldPenaltiesMap()[this.offender.id]?.penaltyInfo.penaltyKey ===
        SystemPenalties.TERMINATE
    );
  });
  selectedPenalty = this.data.selectedPenalty;

  control = new FormControl(
    this.samePenalty() ? this.oldPenaltiesMap()[this.offender.id]?.comment : '',
    {
      nonNullable: true,
      validators: [
        CustomValidators.required,
        CustomValidators.maxLength(10000),
      ],
    },
  );

  dialog = inject(DialogService);
  displayedColumns = ['offender', 'type'];

  assertType(offender: unknown): Offender {
    return offender as Offender;
  }

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
          return this.offenders.map(offender => {
            return new PenaltyDecision().clone<PenaltyDecision>({
              ...this.oldPenaltiesMap()[offender.id],
              caseId: this.model().id,
              penaltyId: this.selectedPenalty.id,
              signerId: this.employeeService.getEmployee()!.id!,
              status: 1,
              comment: this.control.value,
              offenderId: offender.id,
              tkiid: this.model().getTaskId(),
              roleAuthName: this.model().getTeamDisplayName(),
            });
          });
        }),
        switchMap(models => {
          return forkJoin(
            models.map(model => {
              return model.create().pipe(
                map(item =>
                  model.clone<PenaltyDecision>({
                    id: item.id,
                    penaltyInfo: this.selectedPenalty,
                  }),
                ),
              );
            }),
          );
        }),
      )
      .subscribe(models => {
        models &&
          models.forEach(model => {
            this.model().removePenaltyDecision(
              this.oldPenaltiesMap()[model.offenderId],
            );
            this.model().appendPenaltyDecision(model);
          });
        this.toast.success(this.lang.map.the_penalty_saved_successfully);
        this.updateModel().emit();
        this.dialogRef.close();
      });
  }
}
