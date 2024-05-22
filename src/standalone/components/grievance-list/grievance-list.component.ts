import { Component, inject, Input, OnInit, ViewChild } from '@angular/core';
import { Grievance } from '@models/grievance';
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
import { LangService } from '@services/lang.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { BehaviorSubject, filter, Subject, switchMap, takeUntil } from 'rxjs';
import { UserTypes } from '@enums/user-types';
import { EmployeeService } from '@services/employee.service';
import { GrievanceService } from '@services/grievance.service';
import { OnDestroyMixin } from '@mixins/on-destroy-mixin';
import { Pagination } from '@models/pagination';
import { IconButtonComponent } from '@standalone/components/icon-button/icon-button.component';
import { MatTooltip } from '@angular/material/tooltip';
import { DialogService } from '@services/dialog.service';
import { GrievanceCommentPopupComponent } from '@standalone/popups/grievance-comment-popup/grievance-comment-popup.component';

@Component({
  selector: 'app-grievance-list',
  standalone: true,
  imports: [
    MatCell,
    MatPaginator,
    MatRow,
    MatRowDef,
    MatNoDataRow,
    MatHeaderRowDef,
    MatHeaderRow,
    MatCellDef,
    MatHeaderCell,
    MatColumnDef,
    MatHeaderCellDef,
    MatTable,
    MatSort,
    IconButtonComponent,
    MatTooltip,
  ],
  templateUrl: './grievance-list.component.html',
  styleUrl: './grievance-list.component.scss',
})
export class GrievanceListComponent
  extends OnDestroyMixin(class {})
  implements OnInit
{
  lang = inject(LangService);
  employeeService = inject(EmployeeService);
  grievanceService = inject(GrievanceService);
  dialog = inject(DialogService);

  @Input() hidePagination: boolean = false;
  @Input() userId!: number | undefined;
  @ViewChild('paginator') paginator!: MatPaginator;

  reload$: BehaviorSubject<null> = new BehaviorSubject<null>(null);
  comment$: Subject<Grievance> = new Subject<Grievance>();
  attachment$: Subject<Grievance> = new Subject<Grievance>();

  dataSource: MatTableDataSource<Grievance> = new MatTableDataSource();
  grievanceDisplayedColumns = [
    'caseIdentifier',
    'investigationFullSerial',
    'caseStatus',
    'creator',
    'offenderInfo',
    'actions',
  ];

  ngOnInit() {
    this.listenToReload();
    this.listenToComment();
    this.listenToAttachment();
  }

  private listenToReload() {
    this.reload$
      .pipe(takeUntil(this.destroy$))
      .pipe(
        filter(
          () =>
            UserTypes.EXTERNAL_CLEARING_AGENCY !==
              this.employeeService.getLoginData()?.type || !!this.userId,
        ),
      )
      .pipe(
        switchMap(() => {
          return this.grievanceService.getCasesAsList();
        }),
      )
      .subscribe((list: Pagination<Grievance[]>) => {
        this.dataSource.data = !this.hidePagination
          ? (list.rs as Grievance[])
          : (list.rs.splice(0, 5) as Grievance[]);
      });
    if (!this.hidePagination) {
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
    }
  }
  listenToComment() {
    this.comment$
      .pipe(
        switchMap((model: Grievance) => {
          return this.dialog
            .open(GrievanceCommentPopupComponent, {
              data: {
                model,
              },
            })
            .afterClosed();
        }),
      )
      .subscribe();
  }
  listenToAttachment() {
    this.attachment$.pipe().subscribe();
  }
}
