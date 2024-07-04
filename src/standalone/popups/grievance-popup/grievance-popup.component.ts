import { Component, inject, OnInit } from '@angular/core';
import { ButtonComponent } from '@standalone/components/button/button.component';
import { IconButtonComponent } from '@standalone/components/icon-button/icon-button.component';
import { MAT_DIALOG_DATA, MatDialogClose } from '@angular/material/dialog';
import { SelectInputComponent } from '@standalone/components/select-input/select-input.component';
import { InputComponent } from '@standalone/components/input/input.component';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TextareaComponent } from '@standalone/components/textarea/textarea.component';
import { LangService } from '@services/lang.service';
import { filter, Subject, switchMap } from 'rxjs';
import { DialogRef } from '@angular/cdk/dialog';
import { Grievance } from '@models/grievance';
import { DatePipe, NgClass } from '@angular/common';
import { GrievanceService } from '@services/grievance.service';
import { ActivatedRoute } from '@angular/router';
import { EmployeeService } from '@services/employee.service';
import { CaseAttachmentsComponent } from '@standalone/components/case-attachments/case-attachments.component';
import { PenaltyDecisionCriteria } from '@models/penalty-decision-criteria';
import { Config } from '@constants/config';
import { GrievanceComment } from '@models/grievance-comment';
import { FolderType } from '@enums/folder-type.enum';
import { PenaltySignerTypes } from '@enums/penalty-signer-types';

@Component({
  selector: 'app-grievance-popup',
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
  ],
  templateUrl: './grievance-popup.component.html',
  styleUrl: './grievance-popup.component.scss',
})
export class GrievancePopupComponent implements OnInit {
  lang = inject(LangService);
  dialogRef = inject(DialogRef);
  data = inject(MAT_DIALOG_DATA);
  fb = inject(FormBuilder);
  grievanceService = inject(GrievanceService);
  route = inject(ActivatedRoute);
  employeeService = inject(EmployeeService);
  form!: FormGroup;
  save$: Subject<void> = new Subject();
  model: PenaltyDecisionCriteria = this.data.model;
  grievanceModel!: Grievance;
  ngOnInit(): void {
    this._listenToSave();
    this.buildForm();
  }

  buildForm() {
    this.form = this.fb.group(new Grievance().buildForm());
  }

  private _listenToSave() {
    this.save$
      .pipe(filter(() => !!this.form.value))
      .pipe(
        switchMap(() => {
          return this.grievanceService.create({
            ...this.form.value,
            commentList: [
              new GrievanceComment().clone<GrievanceComment>({
                comment: this.form.value.commentList,
                commentDate: new Date(),
              }),
            ],
            offenderId: this.model.id,
            applicantType: this.employeeService.getLoginData()?.type,
          });
        }),
      )
      .subscribe(model => {
        this.grievanceModel = model;
      });
  }

  get sendToTitle() {
    if (
      this.model.penaltySignerRoleInfo.lookupKey ===
      PenaltySignerTypes.MANAGER_DIRECTOR
    ) {
      return 'مساعد الرئيس';
    }
    return 'الرئيس';
  }

  protected readonly config = Config;
  protected readonly FolderType = FolderType;
}
