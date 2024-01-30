import {
  Component,
  OnInit,
  inject,
  Input,
  Output,
  EventEmitter,
  booleanAttribute,
} from '@angular/core';
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
import { Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { OpenFrom } from '@enums/open-from';

@Component({
  selector: 'app-buttons-case-wrapper',
  standalone: true,
  imports: [ButtonComponent, MatIconModule, MatMenuModule],
  templateUrl: './buttons-case-wrapper.component.html',
  styleUrls: ['./buttons-case-wrapper.component.scss'],
})
export class ButtonsCaseWrapperComponent
  extends OnDestroyMixin(class {})
  implements OnInit
{
  lang = inject(LangService);
  dialog = inject(DialogService);
  employeeService = inject(EmployeeService);
  router = inject(Router);
  protected readonly OpenFromEnum = OpenFrom;

  taskResponses = TaskResponses;
  AppIcons = AppIcons;
  sendTypes = SendTypes;
  SaveTypes = SaveTypes;
  responseAction$: Subject<TaskResponses> = new Subject<TaskResponses>();

  @Input() canSave: boolean = true;
  @Input() model?: Investigation;
  @Input() openFrom: OpenFrom = OpenFrom.ADD_SCREEN;
  @Input({ transform: booleanAttribute })
  mandatoryMakePenaltyDecisions: boolean = false;
  @Output() save = new EventEmitter<SaveTypes>();
  @Output() launch = new EventEmitter<SendTypes>();
  @Output() claim = new EventEmitter<Investigation>();
  @Output() release = new EventEmitter<Investigation>();
  @Output() navigateToSamePageThatUserCameFrom = new EventEmitter<void>();

  ngOnInit() {
    this.listenToResponseAction();
  }

  listenToResponseAction() {
    this.responseAction$
      .pipe(takeUntil(this.destroy$))
      .pipe(
        switchMap((response: TaskResponses) => {
          const decisionIds = this.model!.getPenaltyDecision().map(i => i.id);
          return this.dialog
            .open(CommentPopupComponent, {
              data: {
                model: this.model,
                response,
                decisionIds,
              },
            })
            .afterClosed();
        }),
      )
      .pipe(filter((click: unknown) => click === UserClick.YES))
      .subscribe(() => {
        this.navigateToSamePageThatUserCameFrom.emit();
      });
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
    this.model
      ?.claim()
      .pipe(take(1))
      .subscribe((model: Investigation) => {
        this.claim.emit(model);
      });
  }

  close() {
    this.navigateToSamePageThatUserCameFrom.emit();
  }

  releaseItem() {
    this.model
      ?.release()
      .pipe(take(1))
      .subscribe(model => {
        this.release.emit(model);
      });
  }
}
