import { Component, OnInit, inject, Input, Output, EventEmitter } from '@angular/core';
import { ButtonComponent } from '../button/button.component';
import { LangService } from '@services/lang.service';
import { SendTypes } from '@enums/send-types';
import { Subject, filter, switchMap, takeUntil } from 'rxjs';
import { Investigation } from '@models/investigation';
import { TaskResponses } from '@enums/task-responses';
import { CommentPopupComponent } from '@standalone/popups/comment-popup/comment-popup.component';
import { UserClick } from '@enums/user-click';
import { DialogService } from '@services/dialog.service';
import { OnDestroyMixin } from '@mixins/on-destroy-mixin';
import { MatIconModule } from '@angular/material/icon';
import { AppIcons } from '@constants/app-icons';
import { MatMenuModule } from '@angular/material/menu';
import { SaveTypes } from '@enums/save-types';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-buttons-case-wrapper',
  standalone: true,
  imports: [CommonModule, ButtonComponent, MatIconModule, MatMenuModule],
  templateUrl: './buttons-case-wrapper.component.html',
  styleUrls: ['./buttons-case-wrapper.component.scss']
})
export class ButtonsCaseWrapperComponent extends OnDestroyMixin(class {}) implements OnInit {
  lang = inject(LangService);
  dialog = inject(DialogService);
  taskResponses = TaskResponses;
  AppIcons = AppIcons;
  sendTypes = SendTypes;
  SaveTypes = SaveTypes;
  responseAction$: Subject<TaskResponses> = new Subject<TaskResponses>();
  
  @Input() model?: Investigation;

  @Output() onSave = new EventEmitter<SaveTypes>();
  @Output() onLaunch = new EventEmitter<SendTypes>();
  @Output() onClaim = new EventEmitter<Investigation>();
  
  ngOnInit() {
    this.listenToResponseAction();
  }

  listenToResponseAction() {
    this.responseAction$
      .pipe(takeUntil(this.destroy$))
      .pipe(
        switchMap((response: TaskResponses) => {
          return this.dialog
            .open(CommentPopupComponent, {
              data: {
                model: this.model,
                response,
              },
            })
            .afterOpened();
        })
      )
      .pipe(filter((click: any) => click == UserClick.YES))
      .subscribe();
  }

  canLaunch() {
    return this.model?.canStart();
  }
  claim() {
    this.model?.claim().subscribe((model: Investigation) => {
      this.onClaim.emit(model);
    });
  }
}
