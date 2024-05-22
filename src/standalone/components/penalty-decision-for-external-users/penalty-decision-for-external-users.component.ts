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
import { filter, Subject, switchMap, takeUntil } from 'rxjs';
import { PenaltyDecisionService } from '@services/penalty-decision.service';
import { PenaltyDecision } from '@models/penalty-decision';
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
  router = inject(Router);
  selectedTabIndex: number = 0;
  reload$: Subject<null> = new Subject<null>();
  grievance$: Subject<PenaltyDecision> = new Subject<PenaltyDecision>();
  viewDecisionFile$ = new Subject<string>();
  pay$: Subject<PenaltyDecision> = new Subject<PenaltyDecision>();
  @Input() hidePagination: boolean = false;
  @Output() setLength: EventEmitter<number> = new EventEmitter<number>();
  @ViewChild('paginator') paginator!: MatPaginator;
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
    'penalty',
    'status',
    'actions',
  ];
  dataSource: MatTableDataSource<PenaltyDecision> = new MatTableDataSource();

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
    this.reload$.next(null);
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
            ? this.penaltyDecisionService.loadExternal({
                offenderId: this.userId as number,
              })
            : this.penaltyDecisionService.loadExternal();
        }),
      )
      .subscribe(page => {
        this.setLength.emit(page.count);
        this.dataSource.data = !this.hidePagination
          ? (page.rs as PenaltyDecision[])
          : (page.rs.splice(0, 5) as PenaltyDecision[]);
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
      .subscribe();
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
