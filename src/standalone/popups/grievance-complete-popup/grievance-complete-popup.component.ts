import { Component, inject, OnInit } from '@angular/core';
import { ButtonComponent } from '@standalone/components/button/button.component';
import { IconButtonComponent } from '@standalone/components/icon-button/icon-button.component';
import {
  MAT_DIALOG_DATA,
  MatDialogClose,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { TextareaComponent } from '@standalone/components/textarea/textarea.component';
import { LangService } from '@services/lang.service';
import {
  FormBuilder,
  FormControl,
  ReactiveFormsModule,
  UntypedFormGroup,
} from '@angular/forms';
import { OnDestroyMixin } from '@mixins/on-destroy-mixin';
import { LookupService } from '@services/lookup.service';
import { Penalty } from '@models/penalty';
import { GrievanceFinalDecisionsEnum } from '@enums/grievance-final-decisions-enum';
import { CustomValidators } from '@validators/custom-validators';
import { SelectInputComponent } from '@standalone/components/select-input/select-input.component';
import { Grievance } from '@models/grievance';
import { filter, Subject, switchMap, tap } from 'rxjs';
import { UserClick } from '@enums/user-click';
import { DialogService } from '@services/dialog.service';

@Component({
  selector: 'app-grievance-complete-popup',
  standalone: true,
  imports: [
    ButtonComponent,
    IconButtonComponent,
    MatDialogClose,
    MatIcon,
    TextareaComponent,
    SelectInputComponent,
    ReactiveFormsModule,
  ],
  templateUrl: './grievance-complete-popup.component.html',
  styleUrl: './grievance-complete-popup.component.scss',
})
export class GrievanceCompletePopupComponent
  extends OnDestroyMixin(class {})
  implements OnInit
{
  lang = inject(LangService);
  lookupService = inject(LookupService);
  data = inject(MAT_DIALOG_DATA);
  fb = inject(FormBuilder);
  dialogRef = inject(MatDialogRef);
  dialog = inject(DialogService);
  model = this.data.model;
  response = this.data.response;
  grievanceFinalDecisions = this.lookupService.lookups.GrievanceFinalDecision;
  penaltiesList: Penalty[] = [];
  form!: UntypedFormGroup;
  save$: Subject<void> = new Subject<void>();
  ngOnInit(): void {
    this.buildForm();
    this.listenToSave();
    this.loadPenalties();
    this.loadPenalties().subscribe((penalties: Penalty[]) => {
      this.penaltiesList = penalties;
    });
  }
  buildForm() {
    this.form = this.fb.group(
      new Grievance().clone<Grievance>({ ...this.model }).buildCompleteForm(),
    );
  }
  listenToSave() {
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
        switchMap(() => {
          return new Grievance()
            .clone<Grievance>({
              ...this.model,
              ...this.form.getRawValue(),
            })
            .save();
        }),
      )
      .subscribe(() => {
        this.dialogRef.close(UserClick.YES);
      });
  }
  private loadPenalties() {
    return this.model.getService().grievancePenalty(this.model.offenderId);
  }
  handleFinalDecisionChanged(decision: unknown) {
    this.penaltyCtrl.setValidators([]);
    if (decision === GrievanceFinalDecisionsEnum.UPDATE_PENALTY) {
      this.penaltyCtrl.setValidators([CustomValidators.required]);
    }
  }
  get penaltyCtrl(): FormControl {
    return this.form.get('penaltyId') as FormControl;
  }
  get finalDecisionsCtrl(): FormControl {
    return this.form.get('finalDecision') as FormControl;
  }

  protected readonly GrievanceFinalDecisionsEnum = GrievanceFinalDecisionsEnum;
}
