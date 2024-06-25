import { Component, inject, OnInit } from '@angular/core';
import { ButtonComponent } from '@standalone/components/button/button.component';
import { IconButtonComponent } from '@standalone/components/icon-button/icon-button.component';
import { MAT_DIALOG_DATA, MatDialogClose } from '@angular/material/dialog';
import { SelectInputComponent } from '@standalone/components/select-input/select-input.component';
import { LangService } from '@services/lang.service';
import { TextareaComponent } from '@standalone/components/textarea/textarea.component';
import { MatIcon } from '@angular/material/icon';
import { AppIcons } from '@constants/app-icons';
import { GrievanceService } from '@services/grievance.service';
import { filter, Subject, switchMap, takeUntil } from 'rxjs';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { CustomValidators } from '@validators/custom-validators';
import { OnDestroyMixin } from '@mixins/on-destroy-mixin';
import { MatTooltip } from '@angular/material/tooltip';
import { GrievanceComment } from '@models/grievance-comment';

@Component({
  selector: 'app-grievance-comment-popup',
  standalone: true,
  imports: [
    ButtonComponent,
    IconButtonComponent,
    MatDialogClose,
    SelectInputComponent,
    TextareaComponent,
    MatIcon,
    ReactiveFormsModule,
    MatTooltip,
  ],
  templateUrl: './grievance-comment-popup.component.html',
  styleUrl: './grievance-comment-popup.component.scss',
})
export class GrievanceCommentPopupComponent
  extends OnDestroyMixin(class {})
  implements OnInit
{
  lang = inject(LangService);
  data = inject(MAT_DIALOG_DATA);
  grievanceService = inject(GrievanceService);
  comment$: Subject<void> = new Subject<void>();
  commentControl: FormControl = new FormControl('', [
    CustomValidators.required,
    CustomValidators.maxLength(1200),
  ]);
  model = this.data.model;
  protected readonly AppIcons = AppIcons;

  ngOnInit() {
    this.listenToAddComment();
  }

  listenToAddComment() {
    this.comment$
      .pipe(takeUntil(this.destroy$))
      .pipe(filter(() => this.commentControl.valid))
      .pipe(
        switchMap(() => {
          return this.grievanceService.addComment({
            comment: this.commentControl.value,
            caseId: this.model.id,
          });
        }),
      )
      .subscribe(() => {
        this.model.commentList = [
          new GrievanceComment().clone<GrievanceComment>({
            comment: this.commentControl.value,
            commentDate: new Date(),
          }),
          ...this.model.commentList,
        ];
        this.commentControl.reset();
      });
  }
}
