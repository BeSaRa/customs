import { CustomValidators } from '@validators/custom-validators';
import { EmployeeService } from '@services/employee.service';
import { OnDestroyMixin } from '@mixins/on-destroy-mixin';
import { Component, inject, OnInit } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { Offender } from '@models/offender';
import { Penalty } from '@models/penalty';
import { LangService } from '@services/lang.service';
import { IconButtonComponent } from '@standalone/components/icon-button/icon-button.component';
import { ButtonComponent } from '@standalone/components/button/button.component';
import { filter, Subject, switchMap, takeUntil } from 'rxjs';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { SelectInputComponent } from '@standalone/components/select-input/select-input.component';
import { PenaltyDecision } from '@models/penalty-decision';
import { TextareaComponent } from '@standalone/components/textarea/textarea.component';

@Component({
  selector: 'app-make-penalty-decision-popup',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    IconButtonComponent,
    SelectInputComponent,
    ButtonComponent,
    MatDialogModule,
    TextareaComponent,
  ],
  templateUrl: './make-penalty-decision-popup.component.html',
  styleUrls: ['./make-penalty-decision-popup.component.scss'],
})
export class MakePenaltyDecisionPopupComponent
  extends OnDestroyMixin(class {})
  implements OnInit
{
  data = inject(MAT_DIALOG_DATA);
  lang = inject(LangService);
  dialogRef = inject(MatDialogRef);
  save$: Subject<void> = new Subject<void>();
  employeeService = inject(EmployeeService);
  model: Offender = this.data && (this.data.model as Offender);
  caseId: string = this.data && (this.data.caseId as string);
  oldPenalty: PenaltyDecision | undefined = this.data && this.data.oldPenalty;

  penaltyList: Penalty[] =
    this.data && (this.data.penalties || ([] as Penalty[]));
  penaltyImposedBySystem: number | null =
    this.data && this.data.penaltyImposedBySystem;
  form: FormGroup = new FormGroup({
    penalty: new FormControl(
      this.oldPenalty ? this.oldPenalty?.penaltyId : null,
      [CustomValidators.required],
    ),
    comment: new FormControl(this.oldPenalty ? this.oldPenalty?.comment : null),
  });

  ngOnInit(): void {
    this.listenToSave();
  }

  listenToSave() {
    // show form 2
    this.save$
      .pipe(takeUntil(this.destroy$))
      .pipe(filter(() => this.form.valid))
      .pipe(
        switchMap(() => {
          const penaltyDecision = new PenaltyDecision().clone<PenaltyDecision>({
            caseId: this.caseId,
            offenderId: this.model.id,
            signerId: this.employeeService.getEmployee()?.id,
            penaltyId: this.form.value.penalty,
            comment: this.form.value.comment,
            status: 1,
            ...(this.oldPenalty ? { id: this.oldPenalty?.id } : undefined),
          });
          return penaltyDecision.save();
        }),
      )
      .subscribe(model => {
        this.dialogRef.close(model);
      });
  }
}
