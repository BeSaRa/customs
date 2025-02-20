import { Component, OnInit, inject, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { LangKeysContract } from '@contracts/lang-keys-contract';
import { ActionsOnCase } from '@models/actions-on-case';
import { AssignedTo } from '@models/assigned-to';
import { ColumnsWrapper } from '@models/columns-wrapper';
import { NoneFilterColumn } from '@models/none-filter-column';
import { ActionsOnCaseService } from '@services/actions-on-case.service';
import { AssignedToService } from '@services/assigned-to.service';
import { LangService } from '@services/lang.service';
import { ButtonComponent } from '@standalone/components/button/button.component';
import { IconButtonComponent } from '@standalone/components/icon-button/icon-button.component';
import { ignoreErrors } from '@utils/utils';
import { catchError, exhaustMap, of, throwError } from 'rxjs';
import { MatSort } from '@angular/material/sort';
import { MatTab, MatTabGroup } from '@angular/material/tabs';
import { NgTemplateOutlet } from '@angular/common';
import { ActionOnCaseIds } from '@enums/action-on-case-ids';
import { ActionTypes } from '@enums/action-types';

@Component({
  selector: 'app-actions-on-case',
  standalone: true,
  imports: [
    IconButtonComponent,
    ButtonComponent,
    MatDialogModule,
    MatTableModule,
    MatSort,
    MatTabGroup,
    MatTab,
    NgTemplateOutlet,
  ],
  templateUrl: './actions-on-case.component.html',
  styleUrl: './actions-on-case.component.scss',
})
export class ActionsOnCaseComponent implements OnInit {
  data = inject(MAT_DIALOG_DATA);
  lang = inject(LangService);
  actionsOnCaseService = inject(ActionsOnCaseService);
  assignedToService = inject(AssignedToService);
  caseId: string = this.data && (this.data.caseId as string);

  ActionsOnCaseColumnsWrapper: ColumnsWrapper<ActionsOnCase> =
    new ColumnsWrapper(
      new NoneFilterColumn('action'),
      new NoneFilterColumn('userFrom'),
      new NoneFilterColumn('userTo'),
      new NoneFilterColumn('addedOn'),
      new NoneFilterColumn('time'),
      new NoneFilterColumn('comment'),
    );
  assignedToColumnsWrapper: ColumnsWrapper<AssignedTo> = new ColumnsWrapper(
    new NoneFilterColumn('userName'),
    new NoneFilterColumn('isMain'),
    new NoneFilterColumn('stepSubject'),
    new NoneFilterColumn('type'),
  );

  ActionsOnCaseDisplayedList = new MatTableDataSource<ActionsOnCase>();
  ActionsOnCaseDisplayedListForSeen = new MatTableDataSource<ActionsOnCase>();
  ActionsOnCaseDisplayedListForStatementRequest =
    new MatTableDataSource<ActionsOnCase>();
  ActionsOnCaseDisplayedListForPenaltyModificationRecords =
    new MatTableDataSource<ActionsOnCase>();
  assignedToDisplayedList = new MatTableDataSource<AssignedTo>();
  isStatementRequestActionEmpty = signal(true);
  isPenaltyModificationsEmpty = signal(true);
  isSeenEmpty = signal(true);
  isActionsEmpty = signal(true);

  ngOnInit(): void {
    this.loadActionsOnCase();
    this.loadAssignedTo();
  }

  private loadActionsOnCase() {
    of(null)
      .pipe(
        exhaustMap(() => {
          return this.actionsOnCaseService
            .ActionsOnCase({
              caseId: this.caseId,
            })
            .pipe(
              catchError(error => {
                return throwError(error);
              }),
              ignoreErrors(),
            );
        }),
      )
      .subscribe(data => {
        const sortedData = data.sort((a, b) => {
          return (
            new Date(b.updatedOn).getTime() - new Date(a.updatedOn).getTime()
          );
        });
        const [
          others,
          seenRecords,
          statementRequestRecords,
          penaltyModificationRecords,
        ] = [
          sortedData.filter(
            el => !el.guid && el.actionId !== ActionOnCaseIds.SEEN,
          ),
          sortedData.filter(
            el => !el.guid && el.actionId === ActionOnCaseIds.SEEN,
          ),
          sortedData.filter(
            el => el.guid && el.actionType === ActionTypes.STATEMENT_REQUEST,
          ),
          sortedData.filter(
            el => el.guid && el.actionType === ActionTypes.PENALTY_MODIFICATION,
          ),
        ];
        this.ActionsOnCaseDisplayedList = new MatTableDataSource(others);
        this.ActionsOnCaseDisplayedListForSeen = new MatTableDataSource(
          seenRecords,
        );
        this.ActionsOnCaseDisplayedListForStatementRequest =
          new MatTableDataSource(statementRequestRecords);
        this.ActionsOnCaseDisplayedListForPenaltyModificationRecords =
          new MatTableDataSource(penaltyModificationRecords);

        this.isActionsEmpty.set(!others.length);
        this.isSeenEmpty.set(!seenRecords.length);
        this.isStatementRequestActionEmpty.set(!statementRequestRecords.length);
        this.isPenaltyModificationsEmpty.set(
          !penaltyModificationRecords.length,
        );
      });
  }

  private loadAssignedTo() {
    of(null)
      .pipe(
        exhaustMap(() => {
          return this.assignedToService
            .assignedTo({ caseId: this.caseId })
            .pipe(
              catchError(error => {
                return throwError(error);
              }),
              ignoreErrors(),
            );
        }),
      )
      .subscribe(data => {
        this.assignedToDisplayedList = new MatTableDataSource(data);
      });
  }

  getStepName(item: AssignedTo): string {
    return this.lang.map[item.stepSubject as keyof LangKeysContract];
  }

  getTypeName(item: AssignedTo): string {
    return this.lang.map[item.type as keyof LangKeysContract];
  }
}
