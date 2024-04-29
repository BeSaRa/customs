import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
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
import { MatSort } from '@angular/material/sort';
import { DialogService } from '@services/dialog.service';
import { ToastService } from '@services/toast.service';
import { LangService } from '@services/lang.service';
import { LookupService } from '@services/lookup.service';
import { EmployeeService } from '@services/employee.service';
import { filter, Subject, switchMap, takeUntil } from 'rxjs';
import { OnDestroyMixin } from '@mixins/on-destroy-mixin';
import { MatTooltip } from '@angular/material/tooltip';
import { CallRequestService } from '@services/call-request.service';
import { CallRequest } from '@models/call-request';
import { DatePipe } from '@angular/common';
import { ApologyPopupComponent } from '@standalone/popups/apology-popup/apology-popup.component';
import { MatPaginator } from '@angular/material/paginator';
import { ActivatedRoute, Router } from '@angular/router';
import { UserTypes } from '@enums/user-types';
import { ButtonComponent } from '@standalone/components/button/button.component';

@Component({
  selector: 'app-attendance',
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
    MatRow,
    MatHeaderRow,
    MatNoDataRow,
    MatHeaderRowDef,
    MatRowDef,
    MatHeaderCellDef,
    DatePipe,
    MatPaginator,
    ButtonComponent,
  ],
  templateUrl: './attendance.component.html',
  styleUrl: './attendance.component.scss',
})
export class AttendanceComponent
  extends OnDestroyMixin(class {})
  implements OnInit
{
  dialog = inject(DialogService);
  toast = inject(ToastService);
  lang = inject(LangService);
  lookupService = inject(LookupService);
  employeeService = inject(EmployeeService);
  callRequestService = inject(CallRequestService);
  route = inject(ActivatedRoute);
  router = inject(Router);
  dataSource: MatTableDataSource<CallRequest> = new MatTableDataSource();
  reload$: Subject<null> = new Subject<null>();
  apology$: Subject<CallRequest> = new Subject<CallRequest>();
  @Input() hidePagination: boolean = false;
  @Output() setLength: EventEmitter<number> = new EventEmitter<number>();
  @ViewChild('paginator') paginator!: MatPaginator;
  userId!: number | undefined;
  displayedColumns = [
    'fileNumber',
    'summonDateTime',
    'summons',
    'summonsPlace',
    'status',
    'actions',
  ];

  ngOnInit(): void {
    this.listenToReload();
    this.route.queryParams.subscribe(params => {
      this.userId = params.id;
      this.reload$.next(null);
    });
    this._listenToApology();
  }

  showAll() {
    this.router.navigate(['/external/summons-to-attend']);
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
            ? this.callRequestService.loadExternal({
                offenderId: this.userId as number,
              })
            : this.callRequestService.loadExternal(),
        ),
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe(list => {
        this.setLength.emit(list.rs.length);
        this.dataSource.data = !this.hidePagination
          ? list.rs
          : list.rs.splice(0, 5);
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
      });
  }
  private _listenToApology() {
    this.apology$
      .pipe(
        switchMap((model: CallRequest) => {
          return this.dialog
            .open(ApologyPopupComponent, {
              data: {
                model,
              },
            })
            .afterClosed();
        }),
      )
      .subscribe(data => {
        console.log(data);
      });
  }
}
