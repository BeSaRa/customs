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

import { EmployeeService } from '@services/employee.service';
import { OpenFrom } from '@enums/open-from';
import { ActivatedRoute, Router } from '@angular/router';
import { OpenedInfoContract } from '@contracts/opened-info-contract';

@Component({
  selector: 'app-buttons-case-wrapper',
  standalone: true,
  imports: [ButtonComponent, MatIconModule, MatMenuModule],
  templateUrl: './buttons-case-wrapper.component.html',
  styleUrls: ['./buttons-case-wrapper.component.scss'],
})
export class ButtonsCaseWrapperComponent extends OnDestroyMixin(class {}) implements OnInit {
  lang = inject(LangService);
  dialog = inject(DialogService);
  employeeService = inject(EmployeeService);
  route = inject(ActivatedRoute);
  router = inject(Router);
  info: OpenedInfoContract | null = null;

  taskResponses = TaskResponses;
  AppIcons = AppIcons;
  sendTypes = SendTypes;
  SaveTypes = SaveTypes;
  responseAction$: Subject<TaskResponses> = new Subject<TaskResponses>();

  @Input() model?: Investigation;

  @Output() save = new EventEmitter<SaveTypes>();
  @Output() launch = new EventEmitter<SendTypes>();
  @Output() claim = new EventEmitter<Investigation>();

  ngOnInit() {
    this.info = this.route.snapshot.data['info'] as OpenedInfoContract | null;
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
            .afterClosed();
        })
      )
      .pipe(filter((click: unknown) => click == UserClick.YES))
      .subscribe(() => {
        this.navigateToSamePageThatUserCameFrom();
      });
  }

  private navigateToSamePageThatUserCameFrom(): void {
    if (this.info == null) {
      return;
    }
    switch (this.info.openFrom) {
      case OpenFrom.TEAM_INBOX:
        this.router.navigate(['/home/team-inbox']).then();
        break;
      case OpenFrom.USER_INBOX:
        this.router.navigate(['/home/user-inbox']).then();
        break;
      case OpenFrom.SEARCH:
        this.router.navigate(['/home/electronic-services/investigation-search']).then();
        break;
    }
  }

  isApplicantChief() {
    return this.employeeService.isApplicantChief();
  }

  isApplicantManager() {
    return this.employeeService.isApplicantManager();
  }

  canLaunch() {
    return this.model?.canStart();
  }

  claimItem() {
    this.model?.claim().subscribe((model: Investigation) => {
      this.claim.emit(model);
    });
  }
}
