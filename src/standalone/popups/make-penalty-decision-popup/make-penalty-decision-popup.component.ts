import { CustomValidators } from '@validators/custom-validators';
import { EmployeeService } from '@services/employee.service';
import { OnDestroyMixin } from '@mixins/on-destroy-mixin';
import { Component, inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { Offender } from '@models/offender';
import { Penalty } from '@models/penalty';
import { LangService } from '@services/lang.service';
import { IconButtonComponent } from '@standalone/components/icon-button/icon-button.component';
import { ButtonComponent } from '@standalone/components/button/button.component';
import { Subject, switchMap, takeUntil, filter } from 'rxjs';
import { PenaltyDecisionService } from '@services/penalty-decision.service';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { SelectInputComponent } from '@standalone/components/select-input/select-input.component';
import { PenaltyDecision } from '@models/penalty-decision';

@Component({
  selector: 'app-make-penalty-decision-popup',
  standalone: true,
  imports: [ReactiveFormsModule, IconButtonComponent, SelectInputComponent, ButtonComponent, MatDialogModule],
  templateUrl: './make-penalty-decision-popup.component.html',
  styleUrls: ['./make-penalty-decision-popup.component.scss'],
})
export class MakePenaltyDecisionPopupComponent extends OnDestroyMixin(class { }) implements OnInit {
  data = inject(MAT_DIALOG_DATA);
  lang = inject(LangService);
  dilogRef = inject(MatDialogRef);
  penaltyDecisionService = inject(PenaltyDecisionService);
  save$: Subject<void> = new Subject<void>();
  employeeService = inject(EmployeeService);
  model: Offender = this.data && (this.data.model as Offender);
  caseId: string = this.data && (this.data.caseId as string);
  penaltyList: Penalty[] = this.data && (this.data.penalties.second as Penalty[]);
  form: FormGroup = new FormGroup({
    penalty: new FormControl(null, [CustomValidators.required]),
  });
  constructor() {
    super();
  }
  ngOnInit(): void {
    this.listenToSave();
  }
  listenToSave() {
    this.save$
      .pipe(takeUntil(this.destroy$))
      .pipe(filter(() => !!this.form.valid))
      .pipe(
        switchMap(() => {
          return this.penaltyDecisionService.create(
            new PenaltyDecision().clone<PenaltyDecision>({
              caseId: this.caseId,
              offenderId: this.model.id,
              signerId: this.employeeService.getEmployee()?.id,
              penaltyId: this.form.value.penalty,
              status: 1,
            })
          );
        })
      )
      .subscribe(() => this.dilogRef.close());
  }
}