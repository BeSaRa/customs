import { Component, inject, Input, input, OnInit } from '@angular/core';
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
  reload$: BehaviorSubject<null> = new BehaviorSubject<null>(null);
  add$: Subject<void> = new Subject<void>();
  view$: Subject<DecisionMinutes> = new Subject<DecisionMinutes>();
  delete$: Subject<DecisionMinutes> = new Subject<DecisionMinutes>();
  launch$: Subject<DecisionMinutes> = new Subject<DecisionMinutes>();
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
  ngOnInit(): void {
    this._listenToReload();
    this._listenToLaunch();
    this.listenToDelete();
    this._listenToAddDecision();
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
      .subscribe();
  }
  private listenToDelete() {
    this.delete$
      .pipe(takeUntil(this.destroy$))
      .pipe(
        exhaustMap(item => {
          return this.dialog
            .confirm(
              this.lang.map.msg_delete_x_confirm.change({
                x: item.attachmentTypeInfo?.getNames(),
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
              x: item.attachmentTypeInfo?.getNames(),
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
}
