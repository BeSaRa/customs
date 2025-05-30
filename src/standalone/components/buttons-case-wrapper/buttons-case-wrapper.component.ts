import { BaseCaseService } from '@abstracts/base-case.service';
import {
  Component,
  computed,
  EventEmitter,
  inject,
  Input,
  input,
  InputSignal,
  OnInit,
  Output,
  signal,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { Router } from '@angular/router';
import { AppIcons } from '@constants/app-icons';
import { ActivitiesName } from '@enums/activities-name';
import { CaseTypes } from '@enums/case-types';
import { CommonCaseStatus } from '@enums/common-case-status';
import { OpenFrom } from '@enums/open-from';
import { SaveTypes } from '@enums/save-types';
import { SendTypes } from '@enums/send-types';
import { SystemPenalties } from '@enums/system-penalties';
import { TaskNames } from '@enums/task-names';
import { TaskResponses } from '@enums/task-responses';
import { UserClick } from '@enums/user-click';
import { OnDestroyMixin } from '@mixins/on-destroy-mixin';
import { BaseCase } from '@models/base-case';
import { Grievance } from '@models/grievance';
import { Investigation } from '@models/investigation';
import { Penalty } from '@models/penalty';
import { PenaltyDecision } from '@models/penalty-decision';
import { ActionsOnCaseComponent } from '@modules/electronic-services/components/actions-on-case/actions-on-case.component';
import { DialogService } from '@services/dialog.service';
import { EmployeeService } from '@services/employee.service';
import { LangService } from '@services/lang.service';
import { PenaltyDecisionService } from '@services/penalty-decision.service';
import { PenaltyService } from '@services/penalty.service';
import { StatementService } from '@services/statement.service';
import { ToastService } from '@services/toast.service';
import { LegalAffairsProceduresComponent } from '@standalone/components/legal-affairs-procedures/legal-affairs-procedures.component';
import { CommentPopupComponent } from '@standalone/popups/comment-popup/comment-popup.component';
import { GrievanceCompletePopupComponent } from '@standalone/popups/grievance-complete-popup/grievance-complete-popup.component';
import {
  exhaustMap,
  filter,
  Observable,
  of,
  Subject,
  switchMap,
  takeUntil,
  tap,
} from 'rxjs';
import { catchError, map, take } from 'rxjs/operators';
import { ButtonComponent } from '../button/button.component';

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
  statementService = inject(StatementService);
  employee = this.employeeService.getEmployee();
  taskResponses = TaskResponses;
  AppIcons = AppIcons;
  sendTypes = SendTypes;
  SaveTypes = SaveTypes;
  responseAction$: Subject<TaskResponses> = new Subject<TaskResponses>();
  grievanceCompleteAction$: Subject<TaskResponses> =
    new Subject<TaskResponses>();
  approve$: Subject<TaskResponses> = new Subject<TaskResponses>();
  readonly caseTypes = CaseTypes;
  legalAffairsProceduresComponent = input<LegalAffairsProceduresComponent>();
  protected readonly commonCaseStatus = CommonCaseStatus;

  model: InputSignal<
    BaseCase<
      BaseCaseService<Investigation | Grievance>,
      Investigation | Grievance
    >
  > =
    input.required<
      BaseCase<
        BaseCaseService<Investigation | Grievance>,
        Investigation | Grievance
      >
    >();
  @Output()
  updateModel = new EventEmitter<void>();
  @Input() openFrom: OpenFrom = OpenFrom.ADD_SCREEN;
  @Output() save = new EventEmitter<SaveTypes>();
  @Output() launch = new EventEmitter<SendTypes>();
  @Output() claim = new EventEmitter<Investigation | Grievance>();
  @Output() release = new EventEmitter<Investigation | Grievance>();
  @Output() navigateToSamePageThatUserCameFrom = new EventEmitter<void>();
  hasStatementReply = input<boolean>();
  penaltyMap = input<Record<number, { first: number; second: Penalty[] }>>();

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
    this.listenToGrievanceCompleteAction();

    this.listenToLegalAffairsFinalApprove();
  }

  listenToResponseAction() {
    this.responseAction$
      .pipe(takeUntil(this.destroy$))
      .pipe(
        filter(() => {
          return !this._checkIfHasUnlinkedOffenders();
        }),
      )
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

  isLegalAffairsManager() {
    return this.employeeService.isLegalAffairsManager();
  }

  canLaunch() {
    return this.model().canStart();
  }

  reviewStatement() {
    return this.model().isReviewStatement();
  }
  claimItem() {
    this.model()
      .claim()
      .pipe(take(1))
      .subscribe((model: Investigation | Grievance) => {
        if (this.model().caseType === CaseTypes.INVESTIGATION) {
          (this.model() as unknown as Investigation)
            .getPenaltyDecision()
            .forEach(item => {
              (model as unknown as Investigation).appendPenaltyDecision(item);
            });
        }
        this.claim.emit(model);
      });
  }

  close() {
    this.navigateToSamePageThatUserCameFrom.emit();
  }

  releaseItem() {
    if (this._checkIfHasUnlinkedOffenders()) return;
    this.model()
      .release()
      .pipe(take(1))
      .subscribe((model: Investigation | Grievance) => {
        this.release.emit(model);
      });
  }

  protected readonly SystemPenalties = SystemPenalties;
  legalAffairsFinalApprove$ = new Subject<TaskResponses>();

  requestReferralPresidentAssistant() {
    if (this.model().caseType === CaseTypes.INVESTIGATION) {
      this.referralTo(
        TaskResponses.REFERRAL_TO_PRESIDENT_ASSISTANT,
        SystemPenalties.REFERRAL_TO_PRESIDENT_ASSISTANT,
      );
    } else if (this.model().caseType === CaseTypes.GRIEVANCE) {
      this.grievanceCompleteAction$.next(
        TaskResponses.REFERRAL_TO_PRESIDENT_ASSISTANT,
      );
    }
  }

  requestReferralPresident() {
    if (this.model().caseType === CaseTypes.INVESTIGATION) {
      this.referralTo(
        TaskResponses.REFERRAL_TO_PRESIDENT,
        SystemPenalties.REFERRAL_TO_PRESIDENT,
      );
    } else if (this.model().caseType === CaseTypes.GRIEVANCE) {
      this.grievanceCompleteAction$.next(TaskResponses.REFERRAL_TO_PRESIDENT);
    }
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
        filter(() => {
          return !this._checkIfHasUnlinkedOffenders();
        }),
      )
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
          const offenders = (
            this.model() as unknown as Investigation
          ).hasConcernedOffenders()
            ? (
                this.model() as unknown as Investigation
              ).getConcernedOffendersWithOutOldDecision(
                selectedPenalty.penaltyKey,
              )
            : (
                this.model() as unknown as Investigation
              ).getOffendersWithOldDecisions(selectedPenalty.penaltyKey);
          return {
            selectedPenalty,
            response,
            offenders,
          };
        }),
        filter(({ offenders }) => {
          if (
            !offenders.length &&
            !(this.model() as unknown as Investigation).hasUnlinkedViolations()
          ) {
            this.dialog.error(
              this.lang.map
                .there_is_no_offenders_or_unlinked_violations_to_take_this_action,
            );
          }
          return (
            !!offenders.length ||
            (this.model() as unknown as Investigation).hasUnlinkedViolations()
          );
        }),
        exhaustMap(({ offenders, selectedPenalty, response }) => {
          return this.penaltyDecisionService
            .openRequestReferralDialog(
              offenders,
              this.model as unknown as InputSignal<Investigation>,
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
        filter(() => {
          return !this._checkIfHasUnlinkedOffenders();
        }),
      )
      .pipe(
        switchMap(response => {
          if (this.model().getCaseType() === CaseTypes.GRIEVANCE) {
            this.grievanceCompleteAction$.next(response);
            return of(UserClick.NO);
          } else {
            return this.penaltyDecisionService
              .openRequestReferralDialog(
                (
                  this.model() as unknown as Investigation
                ).getConcernedOffenders(),
                this.model as unknown as InputSignal<Investigation>,
                this.updateModel,
                undefined,
                response,
              )
              .afterClosed();
          }
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
        filter(() => {
          return !this._checkIfHasUnlinkedOffenders();
        }),
        filter(
          this._checkAllOffendersAssignedPenaltiesForPresidentAndVPAndManager,
        ),
      )
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
        switchMap(response => {
          const model = this.model();

          if (model instanceof Investigation) {
            if (
              model.inSubmitInvestigationActivity() ||
              response.response === TaskResponses.PR_FRST_APPROVE ||
              response.response === TaskResponses.PA_FRST_APPROVE
            ) {
              return model.penaltyDecisions.length
                ? this.penaltyDecisionService
                    .createBulkFull(
                      model.penaltyDecisions
                        .map(item => {
                          return item.clone<PenaltyDecision>({
                            ...item,
                            signerId: this.employee!.id,
                            tkiid: model.getTaskId(),
                            roleAuthName: model.getTeamDisplayName(),
                          });
                        })
                        .filter(pd =>
                          model
                            .getConcernedOffendersIds()
                            .includes(pd.offenderId),
                        ),
                    )
                    .pipe(map(() => response))
                : of(response);
            } else if (
              model.inReviewApplicantDepartment() &&
              model.getConcernedOffendersIds()
            ) {
              return model.getConcernedOffendersIds()
                ? this.penaltyDecisionService
                    .createBulkFull(
                      model.getConcernedOffendersIds().map(offenderId => {
                        const item = model.penaltyDecisions.find(
                          item => item.offenderId === offenderId,
                        )!;
                        return item.clone<PenaltyDecision>({
                          ...item,
                          signerId: this.employee!.id,
                          tkiid: model.getTaskId(),
                          roleAuthName: model.getTeamDisplayName(),
                        });
                      }),
                    )
                    .pipe(map(() => response))
                : of(response);
            }
          }

          return of(response);
        }),
        switchMap(({ response }) => {
          return (
            this.model().getService() as BaseCaseService<
              Investigation | Grievance
            >
          )
            .completeTask(
              (this.model() as BaseCase<never, never>).getTaskId()!,
              {
                selectedResponse: response,
              },
            )
            .pipe(
              catchError(() => {
                return of();
              }),
            );
        }),
      )
      .pipe(filter(res => !!res))
      .subscribe(() => {
        this.navigateToSamePageThatUserCameFrom.emit();
      });
  }

  listenToGrievanceCompleteAction() {
    this.grievanceCompleteAction$
      .pipe(
        takeUntil(this.destroy$),
        switchMap(response =>
          (
            this.dialog
              .open(GrievanceCompletePopupComponent, {
                data: {
                  model: this.model(),
                },
              })
              .afterClosed() as Observable<{
              click: UserClick;
              comment: string;
            }>
          ).pipe(
            map(({ click, comment }) => ({
              response,
              click,
              comment,
            })),
          ),
        ),
        filter(({ click }) => click === UserClick.YES),
        switchMap(({ response, comment }) =>
          (
            this.model().getService() as BaseCaseService<Grievance>
          ).completeTask(
            (this.model() as BaseCase<never, never>).getTaskId()!,
            {
              selectedResponse: response,
              comment: comment,
            },
          ),
        ),
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
              (
                this.model() as unknown as Investigation
              ).getConcernedOffenders(),
              this.model as unknown as InputSignal<Investigation>,
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
        filter(() => {
          return !this._checkIfHasUnlinkedOffenders();
        }),
      )
      .pipe(
        map(response => {
          return {
            model: this.legalAffairsProceduresComponent()!
              .memorandumMasterComponent()!
              .models$.value.find(
                item =>
                  item.isLegalResult() &&
                  item.isForCurrentTask(this.model() as Investigation),
              ),
            response,
          };
        }),
      )
      .pipe(
        tap(
          ({ model }) =>
            !model &&
            this.dialog.error(
              this.lang.map.you_have_to_approve_one_legal_opinion_at_least,
            ),
        ),
      )
      .pipe(filter(({ model }) => !!model))
      .pipe(
        switchMap(({ model, response }) => {
          return (this.model() as Investigation)
            .getService()
            .openEditMemorandumDialog(
              model!,
              this.model() as Investigation,
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

  private _checkIfHasUnlinkedOffenders() {
    if (
      this.model().getCaseType() === CaseTypes.INVESTIGATION &&
      (this.model() as unknown as Investigation).hasUnlinkedOffenders()
    ) {
      this.dialog.error(
        this.lang.map
          .there_is_offenders_unlinked_to_violations_to_take_this_action,
      );
      return true;
    }
    return false;
  }

  private _checkAllOffendersAssignedPenaltiesForPresidentAndVPAndManager =
    () => {
      if (
        this.model().getActivityName() ===
          ActivitiesName.SUBMIT_INVESTIGATION ||
        this.model().getActivityName() ===
          ActivitiesName.REVIEW_PRESIDENT_ASSISTANT ||
        this.model().getActivityName() === ActivitiesName.REVIEW_PRESIDENT
      ) {
        const _isAllAssignedPenalty = this._getOffendersIds()
          .filter(oId => {
            return this.model().getActivityName() ===
              ActivitiesName.REVIEW_PRESIDENT_ASSISTANT
              ? (this.model() as Investigation)
                  .getConcernedOffendersIds()
                  .find(_oId => _oId === oId)
              : true;
          })
          .every(oId =>
            (this.model() as Investigation).penaltyDecisions.find(
              p =>
                p.offenderId === oId &&
                (this.model().getActivityName() ===
                  ActivitiesName.SUBMIT_INVESTIGATION ||
                  (this.model().getActivityName() ===
                    ActivitiesName.REVIEW_PRESIDENT_ASSISTANT &&
                    p.penaltyInfo.penaltyKey !==
                      SystemPenalties.REFERRAL_TO_PRESIDENT_ASSISTANT) ||
                  (this.model().getActivityName() ===
                    ActivitiesName.REVIEW_PRESIDENT &&
                    p.penaltyInfo.penaltyKey !==
                      SystemPenalties.REFERRAL_TO_PRESIDENT)),
            ),
          );
        if (!_isAllAssignedPenalty) {
          this.dialog.error(
            this.lang.map
              .all_offenders_must_adopted_a_penalty_decision_before_approve,
          );
        }
        return _isAllAssignedPenalty;
      }
      return true;
    };

  private _getOffendersIds() {
    return (this.model() as Investigation).offenderViolationInfo.map(
      i => i.offenderId,
    );
  }

  protected readonly TaskNames = TaskNames;

  isVicePresidentOfficeOrVicePresident() {
    return (
      this.employeeService.isPresidentAssistantOffice() ||
      !!this.employeeService.isPresidentAssisstant()
    );
  }

  openRequestStatementDialog() {
    if (this.model().caseType === this.caseTypes.INVESTIGATION) {
      this.statementService.openRequestStatementDialog(
        this.model() as Investigation,
        false,
      );
    } else if (this.model().caseType === this.caseTypes.GRIEVANCE) {
      this.statementService.openRequestStatementDialog(
        this.model() as Grievance,
        true,
      );
    }
  }

  hasStatementCreatorPermission() {
    return this.employeeService.hasPermissionTo('STATEMENT_CREATOR');
  }

  hasRequestStatement() {
    return (
      this.model().caseType === CaseTypes.INVESTIGATION &&
      !this.reviewStatement() &&
      this.model().caseState !== this.commonCaseStatus.DRAFT &&
      this.hasStatementCreatorPermission() &&
      !!this.model().id
    );
  }

  openRequestStatementDialogForRework() {
    if (this.model().caseType === this.caseTypes.INVESTIGATION) {
      this.statementService.openRequestStatementDialog(
        this.model() as Investigation,
        false,
        true,
      );
    } else if (this.model().caseType === this.caseTypes.GRIEVANCE) {
      this.statementService.openRequestStatementDialog(
        this.model() as Grievance,
        true,
        true,
      );
    }
  }

  isReassign() {
    return [
      ActivitiesName.REVIEW_PRESIDENT,
      ActivitiesName.REVIEW_PRESIDENT_ASSISTANT,
      ActivitiesName.REVIEW_FINAL_PRESIDENT_ASSISTANT,
    ].includes(this.model().getActivityName() as ActivitiesName);
  }
}
