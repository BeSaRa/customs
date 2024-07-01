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
import { OnDestroyMixin } from '@mixins/on-destroy-mixin';
import { DialogService } from '@services/dialog.service';
import { ToastService } from '@services/toast.service';
import { LangService } from '@services/lang.service';
import { LookupService } from '@services/lookup.service';
import { EmployeeService } from '@services/employee.service';
import { filter, map, Subject, switchMap, takeUntil } from 'rxjs';
import { MatSort } from '@angular/material/sort';
import { MatTooltip } from '@angular/material/tooltip';
import { DatePipe, NgTemplateOutlet } from '@angular/common';
import { MatPaginator } from '@angular/material/paginator';
import { UserTypes } from '@enums/user-types';
import { ViewAttachmentPopupComponent } from '@standalone/popups/view-attachment-popup/view-attachment-popup.component';
import { BlobModel } from '@models/blob-model';
import { InvestigationService } from '@services/investigation.service';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonComponent } from '@standalone/components/button/button.component';
import { MatTab, MatTabGroup } from '@angular/material/tabs';
import {
  MatButtonToggle,
  MatButtonToggleGroup,
} from '@angular/material/button-toggle';
import { GrievancePopupComponent } from '@standalone/popups/grievance-popup/grievance-popup.component';
import { GrievanceListComponent } from '@standalone/components/grievance-list/grievance-list.component';
import { OffenderService } from '@services/offender.service';
import { Offender } from '@models/offender';
import { Config } from '@constants/config';
import { Pagination } from '@models/pagination';
import { MatIcon } from '@angular/material/icon';
import { AppIcons } from '@constants/app-icons';

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
    ButtonComponent,
    MatTabGroup,
    MatTab,
    NgTemplateOutlet,
    MatButtonToggle,
    MatButtonToggleGroup,
    GrievanceListComponent,
    MatIcon,
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
  offenderService = inject(OffenderService);
  investigationService = inject(InvestigationService);
  domSanitize = inject(DomSanitizer);
  route = inject(ActivatedRoute);
  router = inject(Router);
  selectedTabIndex: number = 0;
  reload$: Subject<null> = new Subject<null>();
  grievance$: Subject<Offender> = new Subject<Offender>();
  viewDecisionFile$ = new Subject<string>();
  pay$: Subject<Offender> = new Subject<Offender>();
  @Input() hidePagination: boolean = false;
  @Output() setLength: EventEmitter<number> = new EventEmitter<number>();
  @ViewChild('paginator') paginator!: MatPaginator;
  @ViewChild(GrievanceListComponent)
  grievanceListComponent!: GrievanceListComponent;
  _30Day = 30 * 24 * 60 * 60 * 1000;
  user = this.employeeService.getLoginData();
  userId!: number | undefined;
  tabsIndexes: { [key: string]: number } = {
    decisions: 0,
    grievance: 1,
  };
  displayedColumns = [
    'decisionSerial',
    'date',
    'signer',
    'directedTo',
    'penalty',
    'status',
    'actions',
  ];
  dataSource: MatTableDataSource<Offender> = new MatTableDataSource();

  ngOnInit(): void {
    this.listenToReload();
    this.listenGrievance();
    this.route.queryParams.subscribe(params => {
      this.userId = params.id;
      this.reload$.next(null);
    });
    this.listenToViewDecisionFile();
  }
  tabChange($event: number) {
    this.selectedTabIndex = $event;
    if (this.isGrievanceTab) {
      this.grievanceListComponent.reload$.next(null);
    } else {
      this.reload$.next(null);
    }
  }
  showAll() {
    this.router.navigate(['/external/decisions']);
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
          return UserTypes.EXTERNAL_CLEARING_AGENCY ===
            this.employeeService.getLoginData()?.type
            ? this.offenderService.loadExternal({
                offenderId: this.userId as number,
              })
            : this.offenderService.loadExternal();
        }),
      )
      .pipe(
        map((list: Pagination<Offender[]>) => {
          list.rs = list.rs.sort(
            (a, b) =>
              new Date(b.penaltyAppliedDate).getTime() -
              new Date(a.penaltyAppliedDate).getTime(),
          );
          return list;
        }),
      )
      .subscribe(page => {
        this.setLength.emit(page.count);
        this.dataSource.data = !this.hidePagination
          ? (page.rs as Offender[])
          : (page.rs.splice(0, 5) as Offender[]);
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
  private listenGrievance() {
    this.grievance$
      .pipe(
        switchMap(model => {
          return this.dialog
            .open(GrievancePopupComponent, {
              data: {
                model: model,
              },
            })
            .afterClosed();
        }),
      )
      .subscribe(() => {
        this.reload$.next(null);
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
  get isGrievanceTab() {
    return this.selectedTabIndex === this.tabsIndexes.grievance;
  }
  createdOver30Day(element: Offender) {
    return (
      new Date().getTime() - new Date(element.penaltyAppliedDate).getTime() >
      this._30Day
    );
  }
  protected readonly UserTypes = UserTypes;
  protected readonly Config = Config;
  protected readonly AppIcons = AppIcons;
}
