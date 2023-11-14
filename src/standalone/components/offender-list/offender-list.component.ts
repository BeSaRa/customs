import { OffenderViolationService } from '@services/offender-violation.service';
import { EmployeeService } from '@services/employee.service';
import { Component, inject, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconButtonComponent } from '@standalone/components/icon-button/icon-button.component';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { LangService } from '@services/lang.service';
import { exhaustMap, filter, map, Subject, switchMap, takeUntil, tap } from 'rxjs';
import { AppTableDataSource } from '@models/app-table-data-source';
import { OffenderService } from '@services/offender.service';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DialogService } from '@services/dialog.service';
import { OffenderCriteriaPopupComponent } from '@standalone/popups/offender-criteria-popup/offender-criteria-popup.component';
import { Offender } from '@models/offender';
import { OnDestroyMixin } from '@mixins/on-destroy-mixin';
import { LookupService } from '@services/lookup.service';
import { Lookup } from '@models/lookup';
import { UserClick } from '@enums/user-click';
import { ToastService } from '@services/toast.service';
import { Violation } from '@models/violation';
import { OffenderAttachmentPopupComponent } from '@standalone/popups/offender-attachment-popup/offender-attachment-popup.component';
import { Investigation } from '@models/investigation';
import { Penalty } from '@models/penalty';
import { MakePenaltyDecisionPopupComponent } from '@standalone/popups/make-penalty-decision-popup/make-penalty-decision-popup.component';
import { OffenderViolationsPopupComponent } from '@standalone/popups/offender-violations-popup/offender-violations-popup.component';

@Component({
  selector: 'app-offender-list',
  standalone: true,
  imports: [CommonModule, IconButtonComponent, MatSortModule, MatTableModule, MatTooltipModule],
  templateUrl: './offender-list.component.html',
  styleUrls: ['./offender-list.component.scss'],
})
export class OffenderListComponent extends OnDestroyMixin(class {}) implements OnInit {
  dialog = inject(DialogService);
  toast = inject(ToastService);
  lang = inject(LangService);
  lookupService = inject(LookupService);
  employeeService = inject(EmployeeService);
  offenderService = inject(OffenderService);
  offenderViolationService = inject(OffenderViolationService);
  @Input()
  violations!: Violation[];
  @Input()
  caseId?: string;
  @Input()
  investigationModel?: Investigation;
  @Input()
  title: string = this.lang.map.offenders;
  @Input()
  readonly = false;
  add$: Subject<void> = new Subject<void>();
  attachments$: Subject<Offender> = new Subject<Offender>();
  data = new Subject<Offender[]>();
  dataSource = new AppTableDataSource(this.data);
  reload$: Subject<void> = new Subject<void>();
  edit$ = new Subject<Offender>();
  delete$ = new Subject<Offender>();
  makeDecision$ = new Subject<Offender>();
  displayedColumns = ['offenderType', 'arName', 'enName', 'qid', 'jobTitle', 'departmentCompany', 'actions'];
  offenderViolation$: Subject<Offender> = new Subject<Offender>();
  penaltyMap!: { [key: string]: { first: unknown; second: Penalty[] } };
  offenderTypesMap: Record<number, Lookup> = this.lookupService.lookups.offenderType.reduce(
    (acc, item) => ({
      ...acc,
      [item.lookupKey]: item,
    }),
    {}
  );

  ngOnInit(): void {
    this.listenToAdd();
    this.listenToReload();
    this.listenToDelete();
    this.listenToAttachments();
    this.listenToMakeDecision();
    this.listenToOffenderViolation();
    this.reload$.next();
  }

  private listenToAdd() {
    this.add$
      .pipe(
        tap(() => !this.violations.length && this.dialog.error(this.lang.map.add_violation_first_to_take_this_action)),
        filter(() => !!this.violations.length)
      )
      .pipe(
        exhaustMap(() =>
          this.dialog
            .open(OffenderCriteriaPopupComponent, {
              data: {
                caseId: this.caseId,
                violations: this.violations,
                offenders: this.dataSource.data,
              },
            })
            .afterClosed()
        )
      )
      .subscribe(() => this.reload$.next());
  }

  private listenToReload() {
    this.reload$
      .pipe(filter(() => !!this.caseId))
      .pipe(switchMap(() => this.offenderService.load(undefined, { caseId: this.caseId })))
      .pipe(
        tap(() => {
          (this.employeeService.isApplicantManager() || this.employeeService.isApplicantChief()) &&
            this.investigationModel
              ?.getService()
              .getCasePenalty(this.caseId as string)
              .subscribe(data => {
                this.penaltyMap = data;
              });
        })
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe(list => {
        this.data.next(list.rs);
      });
  }
  get canMakeDecision() {
    return this.employeeService.isApplicantManager();
  }
  getOffenderType(type: number) {
    return this.offenderTypesMap[type].getNames();
  }

  private listenToDelete() {
    this.delete$
      .pipe(
        switchMap(model =>
          this.dialog
            .confirm(this.lang.map.msg_delete_x_confirm.change({ x: model.getNames() }))
            .afterClosed()
            .pipe(map(userClick => ({ userClick, model })))
        )
      )
      .pipe(filter(({ userClick }) => userClick === UserClick.YES))
      .pipe(switchMap(({ model }) => model.delete().pipe(map(() => model))))
      .subscribe(model => {
        this.toast.success(this.lang.map.msg_delete_x_success.change({ x: model.getNames() }));
        this.reload$.next();
      });
  }

  deleteAllOffender() {
    this.offenderService.deleteBulk(this.dataSource.data.map((offender: Offender) => offender.id)).subscribe(() => {
      this.reload$.next();
    });
  }
  private listenToAttachments() {
    this.attachments$
      .pipe(
        switchMap(model =>
          this.dialog
            .open(OffenderAttachmentPopupComponent, {
              data: {
                model: this.investigationModel,
                offenderId: model.id,
                readonly: this.readonly,
              },
            })
            .afterClosed()
        )
      )
      .subscribe(model => {
        this.reload$.next();
      });
  }
  private listenToOffenderViolation() {
    this.offenderViolation$
      .pipe(
        switchMap((offender: Offender) =>
          this.dialog
            .open(OffenderViolationsPopupComponent, {
              data: {
                offenderId: offender.id,
                caseId: this.investigationModel?.id,
                violations: this.violations,
                readonly: this.readonly,
              },
            })
            .afterClosed()
        )
      )
      .subscribe();
  }
  private listenToMakeDecision() {
    this.makeDecision$
      .pipe(filter((offender: Offender) => !!this.penaltyMap[offender.id]))
      .pipe(
        switchMap((offender: Offender) =>
          this.dialog
            .open(MakePenaltyDecisionPopupComponent, {
              data: {
                model: offender,
                caseId: this.investigationModel?.id,
                penalties: this.penaltyMap[offender.id],
              },
            })
            .afterClosed()
        )
      )
      .subscribe();
  }
  resetDataList() {
    this.data.next([]);
  }
}
