import { DialogRef } from '@angular/cdk/dialog';
import { DatePipe, NgClass } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogClose } from '@angular/material/dialog';
import { Config } from '@constants/config';
import { UserClick } from '@enums/user-click';
import { CourtDecision } from '@models/court-decision';
import { Penalty } from '@models/penalty';
import { PenaltyDecisionCriteria } from '@models/penalty-decision-criteria';
import { CourtDecisionService } from '@services/court-decision.service';
import { LangService } from '@services/lang.service';
import { LoadingService } from '@services/loading.service';
import { PenaltyService } from '@services/penalty.service';
import { ButtonComponent } from '@standalone/components/button/button.component';
import { CaseAttachmentsComponent } from '@standalone/components/case-attachments/case-attachments.component';
import { IconButtonComponent } from '@standalone/components/icon-button/icon-button.component';
import { InputComponent } from '@standalone/components/input/input.component';
import { SelectInputComponent } from '@standalone/components/select-input/select-input.component';
import { TextareaComponent } from '@standalone/components/textarea/textarea.component';
import { ControlDirective } from '@standalone/directives/control.directive';
import { filter, finalize, Subject, switchMap, take } from 'rxjs';

@Component({
  selector: 'app-court-decision-popup',
  standalone: true,
  imports: [
    ButtonComponent,
    IconButtonComponent,
    MatDialogClose,
    SelectInputComponent,
    InputComponent,
    ReactiveFormsModule,
    TextareaComponent,
    NgClass,
    CaseAttachmentsComponent,
    DatePipe,
    MatDatepickerModule,
    ControlDirective,
    CaseAttachmentsComponent,
  ],
  templateUrl: './court-decision-popup.component.html',
  styleUrl: './court-decision-popup.component.scss',
})
export class CourtDecisionPopupComponent implements OnInit {
  lang = inject(LangService);
  dialogRef = inject(DialogRef);
  data = inject(MAT_DIALOG_DATA);
  fb = inject(FormBuilder);
  courtDecisionService = inject(CourtDecisionService);
  penaltyService = inject(PenaltyService);
  loadingService = inject(LoadingService);

  penalties: Penalty[] = [];

  form!: FormGroup;
  save$: Subject<void> = new Subject();
  model: PenaltyDecisionCriteria = this.data.model;
  protected readonly config = Config;

  ngOnInit(): void {
    this._loadPenalties();
    this._listenToSave();
    this.buildForm();
  }

  buildForm() {
    this.form = this.fb.group(new CourtDecision().buildForm());
  }

  private _listenToSave() {
    this.save$
      .pipe(filter(() => !!this.form.value))
      .pipe(
        switchMap(() => {
          return this.courtDecisionService.create({
            ...this.form.value,
            offenderId: this.model.id,
          });
        }),
      )
      .subscribe(() => {
        this.dialogRef.close(UserClick.YES);
      });
  }

  private _loadPenalties() {
    this.loadingService.show();
    this.penaltyService
      .loadAsLookups()
      .pipe(
        take(1),
        finalize(() => this.loadingService.hide()),
      )
      .subscribe(penalties => (this.penalties = penalties));
  }
}
