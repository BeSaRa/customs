import { animate, state, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, inject } from '@angular/core';
import { IconButtonComponent } from '../icon-button/icon-button.component';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { LangService } from '@services/lang.service';
import { Lookup } from '@models/lookup';
import { LookupService } from '@services/lookup.service';
import { Offender } from '@models/offender';
import { AppTableDataSource } from '@models/app-table-data-source';
import { Subject, filter, switchMap, takeUntil, tap } from 'rxjs';
import { OffenderViolationsPopupComponent } from '@standalone/popups/offender-violations-popup/offender-violations-popup.component';
import { DialogService } from '@services/dialog.service';
import { OffenderAttachmentPopupComponent } from '@standalone/popups/offender-attachment-popup/offender-attachment-popup.component';
import { Investigation } from '@models/investigation';
import { EmployeeService } from '@services/employee.service';
import { MakePenaltyDecisionPopupComponent } from '@standalone/popups/make-penalty-decision-popup/make-penalty-decision-popup.component';
import { Penalty } from '@models/penalty';
import { OffenderService } from '@services/offender.service';
import { OnDestroyMixin } from '@mixins/on-destroy-mixin';

@Component({
  selector: 'app-offenders-violaitons-preview',
  templateUrl: './offenders-violaitons-preview.component.html',
  styleUrls: ['./offenders-violaitons-preview.component.scss'],
  standalone: true,
  imports: [CommonModule, IconButtonComponent, MatSortModule, MatTableModule, MatTooltipModule],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0', display: 'none' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class OffendersViolaitonsPreviewComponent extends OnDestroyMixin(class { }) implements OnInit {
  lang = inject(LangService);
  dialog = inject(DialogService);
  lookupService = inject(LookupService);
  employeeService = inject(EmployeeService);
  offenderService = inject(OffenderService);

  offenderDataSource = new AppTableDataSource<Offender>([]);
  reload$: Subject<void> = new Subject<void>();
  view$: Subject<Offender> = new Subject<Offender>();
  makeDecision$ = new Subject<Offender>();
  attachments$: Subject<Offender> = new Subject<Offender>();
  penaltyMap!: { [key: string]: { first: unknown; second: Penalty[] } };

  @Input({ required: true }) set data(offenders: Offender[]) {
    this.offenderDataSource = new AppTableDataSource(offenders);
  }
  @Input() investigationModel?: Investigation;

  offenderDisplayedColumns = ['arName', 'enName', 'offenderType', 'qid', 'jobTitle', 'departmentCompany', 'actions'];
  ViolationsDisplayedColumns = ['violationClassification', 'violationType', 'violationData', 'repeat'];
  expandedElement!: Offender;
  offenderTypesMap: Record<number, Lookup> = this.lookupService.lookups.offenderType.reduce(
    (acc, item) => ({
      ...acc,
      [item.lookupKey]: item,
    }),
    {}
  );
  ngOnInit(): void {
    this.loadPanalties();
    this.listenToView();
    this.listenToMakeDecision();
    this.listenToAttachments();
  }
  private loadPanalties() {
    this.investigationModel
      ?.getService()
      .getCasePenalty(this.investigationModel?.id as string)
      .subscribe(data => {
        this.penaltyMap = data;
      });
  }
  private listenToView() {
    this.view$.pipe(
      switchMap((offender: Offender) =>
        this.dialog
          .open(OffenderViolationsPopupComponent, {
            data: {
              offender: offender,
              caseId: this.investigationModel?.id,
              violations: offender.violations,
              readonly: true,
            },
          })
          .afterClosed()
      )
    )
      .subscribe();
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
                readonly: true,
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
}

