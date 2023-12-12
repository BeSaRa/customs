import { OnDestroyMixin } from '@mixins/on-destroy-mixin';
import { Component, OnInit, inject } from '@angular/core';
import { LangService } from '@services/lang.service';
import { ButtonComponent } from '@standalone/components/button/button.component';
import { IconButtonComponent } from '@standalone/components/icon-button/icon-button.component';
import { Subject, takeUntil, filter, switchMap } from 'rxjs';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { FormsModule, ReactiveFormsModule, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { CustomValidators } from '@validators/custom-validators';
import { Investigation } from '@models/investigation';
import { TaskResponses } from '@enums/task-responses';
import { UserClick } from '@enums/user-click';
import { TextareaComponent } from '@standalone/components/textarea/textarea.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-comment-popup',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, ButtonComponent, IconButtonComponent, TextareaComponent, MatDialogModule],
  templateUrl: './comment-popup.component.html',
  styleUrls: ['./comment-popup.component.scss'],
})
export class CommentPopupComponent extends OnDestroyMixin(class { }) implements OnInit {
  lang = inject(LangService);
  data = inject(MAT_DIALOG_DATA);
  dialogRef = inject(MatDialogRef);
  comment$ = new Subject<void>();
  form!: UntypedFormGroup;
  model: Investigation = this.data && (this.data.model as Investigation);
  response: TaskResponses = this.data && (this.data.response as TaskResponses);
  isPreviewForm = false;
  chiefToManager = false;
  referralToPresodent = false;
  referralToPresodentAssistant = false;
  previewFormList: TaskResponses[] = [
    TaskResponses.TO_MANAGER,
    TaskResponses.MANAGER_APPROVE,
    TaskResponses.REFERRAL_TO_PRESODENT_ASSISTANT,
    TaskResponses.REFERRAL_TO_PRESODENT,
  ];
  constructor() {
    super();
  }

  ngOnInit() {
    this.chiefToManager = this.response == TaskResponses.TO_MANAGER;
    this.referralToPresodent = this.response == TaskResponses.REFERRAL_TO_PRESODENT;
    this.referralToPresodentAssistant = this.response == TaskResponses.REFERRAL_TO_PRESODENT_ASSISTANT;
    
    this.buildForm();
    this.listenToComment();
    this.isPreviewForm = this.previewFormList.includes(this.response)
  }
  buildForm() {
    this.form = new UntypedFormGroup({
      comment: new UntypedFormControl('', [CustomValidators.required]),
    });
  }
  isResponse(response: TaskResponses) {
    return this.response == response;
  }
  listenToComment() {
    this.comment$
      .pipe(takeUntil(this.destroy$))
      .pipe(filter(_ => !!this.form.valid))
      .pipe(
        switchMap(() => {
          const completeBody = {
            selectedResponse: this.response,
            comment: this.form.value.comment,
            // userId
          };
          return this.model.getService().completeTask(this.model.taskDetails.tkiid, completeBody);
        })
      )
      .subscribe(() => {
        this.dialogRef.close(UserClick.YES);
      });
  }
}
