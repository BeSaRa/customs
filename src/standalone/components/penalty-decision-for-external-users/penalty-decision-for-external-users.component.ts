import { Component, inject, OnInit, ViewChild } from '@angular/core';
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
  MatTableDataSource,
} from '@angular/material/table';
import { OnDestroyMixin } from '@mixins/on-destroy-mixin';
import { DialogService } from '@services/dialog.service';
import { ToastService } from '@services/toast.service';
import { LangService } from '@services/lang.service';
import { LookupService } from '@services/lookup.service';
import { EmployeeService } from '@services/employee.service';
import { filter, Subject, switchMap, takeUntil } from 'rxjs';
import { PenaltyDecisionService } from '@services/penalty-decision.service';
import { PenaltyDecision } from '@models/penalty-decision';
import { MatSort } from '@angular/material/sort';
import { MatTooltip } from '@angular/material/tooltip';
import { DatePipe } from '@angular/common';
import { MatPaginator } from '@angular/material/paginator';
import { UserTypes } from '@enums/user-types';
import { ViewAttachmentPopupComponent } from '@standalone/popups/view-attachment-popup/view-attachment-popup.component';
import { BlobModel } from '@models/blob-model';
import { InvestigationService } from '@services/investigation.service';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-penalty-decision-for-external-users',
  standalone: true,
  imports: [
    IconButtonComponent,
    MatCell,
    MatCellDef,
    MatColumnDef,
    MatHeaderCell,
    MatSort,
    MatTable,
    MatTooltip,
    MatHeaderRow,
    MatRow,
    MatNoDataRow,
    MatHeaderRowDef,
    MatHeaderCellDef,
    MatRowDef,
    DatePipe,
    MatPaginator,
  ],
  templateUrl: './penalty-decision-for-external-users.component.html',
  styleUrl: './penalty-decision-for-external-users.component.scss',
})
export class PenaltyDecisionForExternalUsersComponent
  extends OnDestroyMixin(class {})
  implements OnInit
{
  dialog = inject(DialogService);
  toast = inject(ToastService);
  lang = inject(LangService);
  lookupService = inject(LookupService);
  employeeService = inject(EmployeeService);
  penaltyDecisionService = inject(PenaltyDecisionService);
  investigationService = inject(InvestigationService);
  domSanitize = inject(DomSanitizer);
  route = inject(ActivatedRoute);
  dataSource: MatTableDataSource<PenaltyDecision> = new MatTableDataSource();
  reload$: Subject<null> = new Subject<null>();
  grievance$: Subject<PenaltyDecision> = new Subject<PenaltyDecision>();
  view$: Subject<PenaltyDecision> = new Subject<PenaltyDecision>();
  viewDecisionFile$ = new Subject<string>();
  pay$: Subject<PenaltyDecision> = new Subject<PenaltyDecision>();
  protected readonly userTypes = UserTypes;
  @ViewChild('paginator') paginator!: MatPaginator;
  userId!: number | undefined;
  displayedColumns = [
    'decisionSerial',
    'decisionDate',
    'status',
    'signer',
    'penalty',
    'actions',
  ];

  ngOnInit(): void {
    this.listenToReload();
    this.route.queryParams.subscribe(params => {
      this.userId = params.id;
      this.reload$.next(null);
    });
    this.listenToViewDecisionFile();
  }

  private listenToReload() {
    this.reload$
      .pipe(
        filter(
          () =>
            UserTypes.EXTERNAL_CLEARING_AGENCY !==
              this.employeeService.getLoginData()?.type || !!this.userId,
        ),
      )
      .pipe(
        switchMap(() =>
          UserTypes.EXTERNAL_CLEARING_AGENCY ===
          this.employeeService.getLoginData()?.type
            ? this.penaltyDecisionService.loadExternal({
                offenderId: this.userId as number,
              })
            : this.penaltyDecisionService.loadExternal(),
        ),
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe(list => {
        this.dataSource.data = list.rs;
        this.dataSource.paginator = this.paginator;
        this.paginator._intl.getRangeLabel = (
          page: number,
          pageSize: number,
          length: number,
        ) => {
          const start = page * pageSize + 1;
          const end = Math.min((page + 1) * pageSize, length);
          return `${start} - ${end} ${this.lang.map.of} ${length}`;
        };
      });
  }

  private listenToViewDecisionFile() {
    this.viewDecisionFile$
      .pipe(
        switchMap(vsId => {
          return this.investigationService.getDecisionFileAttachments(vsId);
        }),
      )
      .pipe(
        switchMap(model => {
          return this.dialog
            .open(ViewAttachmentPopupComponent, {
              data: {
                model: new BlobModel(
                  model.content as unknown as Blob,
                  this.domSanitize,
                ),
                title: model.documentTitle,
              },
            })
            .afterClosed();
        }),
      )
      .subscribe();
  }
  protected readonly UserTypes = UserTypes;
}
