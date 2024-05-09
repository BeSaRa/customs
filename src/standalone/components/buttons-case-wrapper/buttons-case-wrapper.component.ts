import {
  Component,
  computed,
  EventEmitter,
  inject,
  Input,
  input,
  OnInit,
  Output,
  signal,
} from '@angular/core';
import { ButtonComponent } from '../button/button.component';
import { LangService } from '@services/lang.service';
import { SendTypes } from '@enums/send-types';
import { exhaustMap, filter, Subject, switchMap, takeUntil, tap } from 'rxjs';
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
import { PenaltyService } from '@services/penalty.service';
import { ActionsOnCaseComponent } from '@modules/electronic-services/components/actions-on-case/actions-on-case.component';
import { LegalAffairsProceduresComponent } from '@standalone/components/legal-affairs-procedures/legal-affairs-procedures.component';
import { MemorandumCategories } from '@enums/memorandum-categories';
import { ToastService } from '@services/toast.service';

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
  penaltyService = inject(PenaltyService);
  router = inject(Router);
  protected readonly OpenFromEnum = OpenFrom;
  toast = inject(ToastService);
  taskResponses = TaskResponses;
  AppIcons = AppIcons;
  sendTypes = SendTypes;
  SaveTypes = SaveTypes;
  responseAction$: Subject<TaskResponses> = new Subject<TaskResponses>();
  approve$: Subject<TaskResponses> = new Subject<TaskResponses>();

  legalAffairsProceduresComponent = input<LegalAffairsProceduresComponent>();

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

  systemPenaltiesMap = computed(() => this.penaltyService.systemPenaltiesMap());

  referralRequest$ = new Subject<{
    response: TaskResponses;
    penaltyKey: SystemPenalties;
  }>();

  returnActions$ = new Subject<TaskResponses>();
  ask$ = new Subject<TaskResponses>();

  isMandatoryToImposePenalty = input.required<boolean>();

  ngOnInit() {
    this.listenToResponseAction();
    this.listenToReferralActions();
    this.listenToReturnActions();
    this.listenToApproveAction();
    this.listenToAskAction();

    this.listenToLegalAffairsFinalApprove();
  }

  listenToResponseAction() {
    this.responseAction$
      .pipe(takeUntil(this.destroy$))
      .pipe(
        switchMap((response: TaskResponses) => {
          return this.dialog
            .open(CommentPopupComponent, {
              data: {
                model: this.model(),
                response,
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
  legalAffairsFinalApprove$ = new Subject<TaskResponses>();

  requestReferralPresidentAssistant() {
    this.referralTo(
      TaskResponses.REFERRAL_TO_PRESIDENT_ASSISTANT,
      SystemPenalties.REFERRAL_TO_PRESIDENT_ASSISTANT,
    );
  }

  requestReferralPresident() {
    this.referralTo(
      TaskResponses.REFERRAL_TO_PRESIDENT,
      SystemPenalties.REFERRAL_TO_PRESIDENT,
    );
  }

  referralToLegalAffairs() {
    this.referralTo(
      TaskResponses.PRESIDENT_ASSISTANT_LAUNCH_LEGAL_AFFAIRS,
      SystemPenalties.REFERRAL_TO_LEGAL_AFFAIRS,
    );
  }

  presidentToLegalAffairs() {
    this.referralTo(
      TaskResponses.PR_LAUNCH_LEGAL_AFFAIRS,
      SystemPenalties.REFERRAL_TO_LEGAL_AFFAIRS,
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
            selectedPenalty: this.systemPenaltiesMap()[penaltyKey],
            response,
          };
        }),
      )
      .pipe(
        map(({ selectedPenalty, response }) => {
          const offenders = this.model().hasConcernedOffenders()
            ? this.model().getConcernedOffendersWithOutOldDecision(
                selectedPenalty.penaltyKey,
              )
            : this.model().getOffendersWithOldDecisions(
                selectedPenalty.penaltyKey,
              );
          return {
            selectedPenalty,
            response,
            offenders,
          };
        }),
        filter(({ offenders }) => {
          if (!offenders.length && !this.model().hasUnlinkedViolations()) {
            this.dialog.error(
              this.lang.map
                .there_is_no_offenders_or_unlinked_violations_to_take_this_action,
            );
          }
          return !!offenders.length || this.model().hasUnlinkedViolations();
        }),
        exhaustMap(({ offenders, selectedPenalty, response }) => {
          return this.penaltyDecisionService
            .openRequestReferralDialog(
              offenders,
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

  listenToReturnActions(): void {
    this.returnActions$
      .pipe(takeUntil(this.destroy$))
      .pipe(
        switchMap(response => {
          return this.penaltyDecisionService
            .openRequestReferralDialog(
              this.model().getConcernedOffenders(),
              this.model,
              this.updateModel,
              undefined,
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

  private listenToApproveAction() {
    this.approve$
      .pipe(
        exhaustMap(response => {
          return this.dialog
            .confirm(this.lang.map.approve_msg_confirmation)
            .afterClosed()
            .pipe(
              map(userClick => {
                return {
                  click: userClick,
                  response,
                };
              }),
            );
        }),
        filter(({ click }) => {
          return click === UserClick.YES;
        }),
        switchMap(({ response }) => {
          return this.model()
            .getService()
            .completeTask(this.model().getTaskId()!, {
              selectedResponse: response,
            });
        }),
      )
      .subscribe(() => {
        this.navigateToSamePageThatUserCameFrom.emit();
      });
  }

  private listenToAskAction() {
    this.ask$
      .pipe(takeUntil(this.destroy$))
      .pipe(
        switchMap(response => {
          return this.penaltyDecisionService
            .openRequestReferralDialog(
              this.model().getConcernedOffenders(),
              this.model,
              this.updateModel,
              undefined,
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

  showActionsOnCase() {
    this.dialog.open(ActionsOnCaseComponent, {
      data: { caseId: this.model().id },
    });
  }

  private listenToLegalAffairsFinalApprove() {
    this.legalAffairsFinalApprove$
      .pipe(
        switchMap(response => {
          return this.legalAffairsProceduresComponent()!
            .memorandumMasterComponent()!
            .models$.pipe(
              map(models =>
                models.find(
                  item => item.category === MemorandumCategories.LEGAL_RESULT,
                ),
              ),
            )
            .pipe(
              map(model => {
                return { model, response };
              }),
            );
        }),
      )
      .pipe(
        tap(
          ({ model }) =>
            !model &&
            this.dialog.error(
              this.lang.map
                .there_is_no_investigation_result_to_perform_this_action,
            ),
        ),
      )
      .pipe(filter(({ model }) => !!model))
      .pipe(
        switchMap(({ model, response }) => {
          return this.model()
            .getService()
            .openEditMemorandumDialog(
              model!,
              this.model(),
              signal(this.updateModel),
              response,
            )
            .afterClosed();
        }),
      )
      .pipe(filter(value => !!value))
      .subscribe(() => {
        this.navigateToSamePageThatUserCameFrom.emit();
      });
  }
}
