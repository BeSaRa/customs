import {
  Component,
  computed,
  inject,
  Input,
  input,
  OnInit,
  signal,
} from '@angular/core';
import { DatePipe } from '@angular/common';
import { IconButtonComponent } from '@standalone/components/icon-button/icon-button.component';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatNoDataRow,
  MatRow,
  MatRowDef,
  MatTable,
} from '@angular/material/table';
import { EmployeeService } from '@services/employee.service';
import { LangService } from '@services/lang.service';
import { DialogService } from '@services/dialog.service';
import { InvestigationService } from '@services/investigation.service';
import { ToastService } from '@services/toast.service';
import {
  BehaviorSubject,
  exhaustMap,
  filter,
  map,
  of,
  shareReplay,
  Subject,
  switchMap,
  takeUntil,
  tap,
} from 'rxjs';
import { Investigation } from '@models/investigation';
import { Config } from '@constants/config';
import { OnDestroyMixin } from '@mixins/on-destroy-mixin';
import { MatTooltip } from '@angular/material/tooltip';
import { MatSort } from '@angular/material/sort';
import { DecisionMinutes } from '@models/decision-minutes';
import { DecisionMinutesPopupComponent } from '@standalone/popups/decision-minutes-popup/decision-minutes-popup.component';
import { UserClick } from '@enums/user-click';
import { ignoreErrors } from '@utils/utils';
import { GeneralStatusEnum } from '@enums/general-status-enum';
import { Offender } from '@models/offender';
import { PenaltyDecisionService } from '@services/penalty-decision.service';
import { Penalty } from '@models/penalty';
import { PenaltyDecisionContract } from '@contracts/penalty-decision-contract';
import { ManagerDecisions } from '@enums/manager-decisions';
import { PenaltyDecision } from '@models/penalty-decision';
import { ActivitiesName } from '@enums/activities-name';
@Component({
  selector: 'app-decision-minutes',
  standalone: true,
  imports: [
    DatePipe,
    IconButtonComponent,
    MatCell,
    MatCellDef,
    MatColumnDef,
    MatHeaderCell,
    MatTooltip,
    MatTable,
    MatSort,
    MatHeaderCellDef,
    MatHeaderRow,
    MatHeaderRowDef,
    MatRowDef,
    MatRow,
    MatNoDataRow,
  ],
  templateUrl: './decision-minutes.component.html',
  styleUrl: './decision-minutes.component.scss',
})
export class DecisionMinutesComponent
  extends OnDestroyMixin(class {})
  implements OnInit
{
  employeeService = inject(EmployeeService);
  lang = inject(LangService);
  dialog = inject(DialogService);
  investigationService = inject(InvestigationService);
  toast = inject(ToastService);
  penaltyDecisionService = inject(PenaltyDecisionService);
  reload$: BehaviorSubject<null> = new BehaviorSubject<null>(null);
  add$: Subject<void> = new Subject<void>();
  view$: Subject<DecisionMinutes> = new Subject<DecisionMinutes>();
  delete$: Subject<DecisionMinutes> = new Subject<DecisionMinutes>();
  launch$: Subject<DecisionMinutes> = new Subject<DecisionMinutes>();
  editDecisionMinutes$: Subject<DecisionMinutes> =
    new Subject<DecisionMinutes>();
  loadPenalties$ = new Subject<void>();
  penaltiesLoaded$ = this.loadPenalties$
    // .pipe(filter(() => this.canLoadPenalties()))
    .pipe(switchMap(() => this.loadPenalties()))
    .pipe(takeUntil(this.destroy$))
    .pipe(tap(data => this.penaltyMap.set(data)))
    .pipe(shareReplay(1));

  model = input.required<Investigation>();
  dataList: DecisionMinutes[] = [];
  config = Config;
  generalStatusEnum = GeneralStatusEnum;
  displayedColumns: string[] = [
    'offender',
    'penalty',
    'decisionTypeInfo',
    'status',
    'creationDate',
    'creator',
    'actions',
  ];
  @Input()
  readonly: boolean = false;

  penaltyMap = signal<
    Record<number, { first: number | null; second: Penalty[] }>
  >({});

  penalties = computed(() => {
    return Object.keys(this.penaltyMap()).reduce<
      Record<string, PenaltyDecisionContract>
    >((acc, offenderId) => {
      if (!acc[offenderId]) {
        acc[offenderId] = {
          managerDecisionControl: this.penaltyMap()[Number(offenderId)].first,
          system: this.penaltyMap()[Number(offenderId)].second.filter(
            p => p.isSystem,
          ),
          normal: this.penaltyMap()[Number(offenderId)].second.filter(
            p => !p.isSystem,
          ),
        };
      }
      return { ...acc };
    }, {});
  });
  ngOnInit(): void {
    this._listenToReload();
    this._listenToLaunch();
    this.listenToDelete();
    this._listenToAddDecision();
    this.listenToLoadPenalties();
    this.listenToEditDecisionDialog();
    this.listenToView();
    this.loadPenalties$.next();
  }

  private listenToLoadPenalties() {
    this.penaltiesLoaded$.subscribe();
  }
  // private canLoadPenalties(): boolean {
  //   return !!(
  //     this.model() &&
  //     this.model().hasTask() && // next 2 conditions to make sure to not run this code for case without task and activityName
  //     this.model().getActivityName() &&
  //     this.model().getTaskName()
  //   );
  // }

  private loadPenalties() {
    return this.model()
      ? this.model()
          .getService()
          .getCasePenalty(
            this.model().id as string,
            ActivitiesName.REVIEW_DISCIPLINARY_COUNCIL,
          )
      : of(
          {} as Record<string, { first: ManagerDecisions; second: Penalty[] }>,
        );
  }
  _listenToReload() {
    this.reload$
      .pipe(
        switchMap(() => {
          return this.investigationService.getDisciplinaryDecisions(
            this.model().id,
          );
        }),
      )
      .subscribe(res => {
        this.dataList = res;
      });
  }

  listenToEditDecisionDialog() {
    this.editDecisionMinutes$
      .pipe(
        switchMap(model => {
          return this.penaltyDecisionService
            .openDCDecisionDialog(
              new Offender().clone<Offender>({
                ...model.penaltyDecisionInfo.offenderInfo,
                id: model.penaltyDecisionInfo.offenderId,
              }),
              true,
              this.model,
              this.penaltyMap()[model.penaltyDecisionInfo.offenderId],
            )
            .afterClosed()
            .pipe(
              filter(click => !!click),
              map(penaltyDecision => {
                return { penaltyDecision, decisionMinutes: model };
              }),
            );
        }),
      )
      .pipe(
        switchMap(payload => {
          if (
            payload.decisionMinutes.generalStatus ===
            GeneralStatusEnum.DC_M_LAUNCHED
          ) {
            return this.investigationService.reviewTaskDecision(
              this.model().taskDetails.tkiid,
              (payload.penaltyDecision as PenaltyDecision).id,
              (payload.penaltyDecision as PenaltyDecision).offenderId,
              true,
            );
          } else {
            return of(null);
          }
        }),
      )
      .subscribe(() => {
        this.reload$.next(null);
      });
  }

  _listenToLaunch() {
    this.launch$
      .pipe(
        switchMap(decision => {
          return this.investigationService.reviewTaskDecision(
            this.model().taskDetails.tkiid,
            decision.concernedId,
            decision.offenderIds[0],
          );
        }),
      )
      .subscribe(() => this.reload$.next(null));
  }
  private listenToDelete() {
    this.delete$
      .pipe(takeUntil(this.destroy$))
      .pipe(
        exhaustMap(item => {
          return this.dialog
            .confirm(
              this.lang.map.msg_delete_x_confirm.change({
                x: item.penaltyDecisionInfo?.penaltyInfo?.getNames(),
              }),
            )
            .afterClosed()
            .pipe(
              map(userClick => {
                return { userClick: userClick, item };
              }),
            );
        }),
      )
      .pipe(filter(response => response.userClick === UserClick.YES))
      .pipe(
        exhaustMap(response =>
          response.item
            .delete(this.investigationService)
            .pipe(ignoreErrors())
            .pipe(map(() => response.item)),
        ),
      )
      .pipe(
        tap(item =>
          this.toast.success(
            this.lang.map.msg_delete_x_success.change({
              x: item.penaltyDecisionInfo?.penaltyInfo?.getNames(),
            }),
          ),
        ),
      )
      .subscribe(() => this.reload$.next(null));
  }
  _listenToAddDecision() {
    this.add$
      .pipe(
        switchMap(() => {
          return this.dialog
            .open(DecisionMinutesPopupComponent, {
              data: {
                model: this.model,
                extras: {
                  caseId: this.model().id,
                  decisionMinutesList: this.dataList,
                  penaltyMap: this.penaltyMap,
                },
              },
            })
            .afterClosed();
        }),
      )
      .subscribe(() => {
        this.reload$.next(null);
      });
  }

  listenToView() {
    this.view$
      .pipe(
        switchMap(model => {
          return this.penaltyDecisionService
            .openDCDecisionDialog(
              new Offender().clone<Offender>({
                ...model.penaltyDecisionInfo.offenderInfo,
                id: model.penaltyDecisionInfo.offenderId,
              }),
              true,
              this.model,
              this.penaltyMap()[model.penaltyDecisionInfo.offenderId],
              true,
            )
            .afterClosed();
        }),
      )
      .subscribe();
  }
}
