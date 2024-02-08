import {
  Component,
  computed,
  effect,
  EventEmitter,
  inject,
  Input,
  input,
  OnInit,
  Output,
} from '@angular/core';
import { ButtonComponent } from '../button/button.component';
import { LangService } from '@services/lang.service';
import { SendTypes } from '@enums/send-types';
import { exhaustMap, filter, Subject, switchMap, takeUntil } from 'rxjs';
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
import { map, take } from 'rxjs/operators';
import { OpenFrom } from '@enums/open-from';
import { SystemPenalties } from '@enums/system-penalties';
import { PenaltyDecisionService } from '@services/penalty-decision.service';
import { Penalty } from '@models/penalty';

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
  penaltyDecisionService = inject(PenaltyDecisionService);
  router = inject(Router);
  protected readonly OpenFromEnum = OpenFrom;

  taskResponses = TaskResponses;
  AppIcons = AppIcons;
  sendTypes = SendTypes;
  SaveTypes = SaveTypes;
  responseAction$: Subject<TaskResponses> = new Subject<TaskResponses>();

  @Input() canSave: boolean = true;
  model = input.required<Investigation>();
  @Output()
  updateModel = new EventEmitter<void>();
  @Input() openFrom: OpenFrom = OpenFrom.ADD_SCREEN;
  @Output() save = new EventEmitter<SaveTypes>();
  @Output() launch = new EventEmitter<SendTypes>();
  @Output() claim = new EventEmitter<Investigation>();
  @Output() release = new EventEmitter<Investigation>();
  @Output() navigateToSamePageThatUserCameFrom = new EventEmitter<void>();

  penaltyMap =
    input.required<Record<number, { first: number; second: Penalty[] }>>();

  uniquePenalties = computed(() => {
    return Object.values(this.penaltyMap()).reduce<
      Record<SystemPenalties, Penalty>
    >(
      (acc, item) => {
        const penalties = item.second.reduce((acc, penalty) => {
          return { ...acc, [penalty.penaltyKey]: penalty };
        }, {});
        return { ...acc, ...penalties };
      },
      {} as Record<SystemPenalties, Penalty>,
    );
  });

  penaltiesEffect = effect(() => {
    console.log('UNIQUE', this.uniquePenalties());
  });

  referralRequest$ = new Subject<{
    response: TaskResponses;
    penaltyKey: SystemPenalties;
  }>();

  isMandatoryToImposePenalty = input.required<boolean>();

  ngOnInit() {
    this.listenToResponseAction();
    this.listenToReferralActions();
  }

  listenToResponseAction() {
    this.responseAction$
      .pipe(takeUntil(this.destroy$))
      .pipe(
        switchMap((response: TaskResponses) => {
          const decisionIds = this.model()
            .getPenaltyDecision()
            .map(i => i.id);
          return this.dialog
            .open(CommentPopupComponent, {
              data: {
                model: this.model(),
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
    return this.model().canStart();
  }

  claimItem() {
    this.model()
      .claim()
      .pipe(take(1))
      .subscribe((model: Investigation) => {
        this.model()
          .getPenaltyDecision()
          .forEach(item => {
            model.appendPenaltyDecision(item);
          });
        this.claim.emit(model);
      });
  }

  close() {
    this.navigateToSamePageThatUserCameFrom.emit();
  }

  releaseItem() {
    this.model()
      .release()
      .pipe(take(1))
      .subscribe(model => {
        this.release.emit(model);
      });
  }

  protected readonly SystemPenalties = SystemPenalties;

  referralPresidentAssistant() {
    this.referralTo(
      TaskResponses.REFERRAL_TO_PRESIDENT_ASSISTANT,
      SystemPenalties.REFERRAL_TO_PRESIDENT_ASSISTANT,
    );
  }

  referralPresident() {
    this.referralTo(
      TaskResponses.REFERRAL_TO_PRESIDENT,
      SystemPenalties.REFERRAL_TO_PRESIDENT,
    );
  }

  referralTo(response: TaskResponses, penaltyKey: SystemPenalties) {
    this.referralRequest$.next({
      penaltyKey,
      response,
    });
  }

  private listenToReferralActions() {
    this.referralRequest$
      .pipe(takeUntil(this.destroy$))
      .pipe(
        map(({ penaltyKey, response }) => {
          return {
            selectedPenalty: this.uniquePenalties()[penaltyKey],
            response,
          };
        }),
      )
      .pipe(
        exhaustMap(({ selectedPenalty, response }) => {
          return this.penaltyDecisionService
            .openRequestReferralDialog(
              this.model().hasConcernedOffenders()
                ? this.model().getConcernedOffendersWithOutOldDecision(
                    selectedPenalty.penaltyKey,
                  )
                : this.model().getOffendersWithOldDecisions(
                    selectedPenalty.penaltyKey,
                  ),
              this.model,
              this.updateModel,
              selectedPenalty,
              response,
            )
            .afterClosed();
        }),
      )
      .pipe(filter((click: UserClick) => click === UserClick.YES))
      .subscribe(() => {
        this.navigateToSamePageThatUserCameFrom.emit();
      });
  }
}
