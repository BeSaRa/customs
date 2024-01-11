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
import { AssignmentToAttendPopupComponent } from '../assignment-to-attend-popup/assignment-to-attend-popup.component';
import { UserTypes } from '@enums/user-types';
import { OffenderTypes } from '@enums/offender-types';
import { SituationSearchComponent } from '@modules/electronic-services/components/situation-search/situation-search.component';
import { TaskResponses } from '@enums/task-responses';
import { MatMenuModule } from '@angular/material/menu';
import { SusbendEmployeePopupComponent } from '@standalone/popups/susbend-employee-popup/susbend-employee-popup.component';
import { SystemPenalties } from '@enums/system-penalties';
import { PenaltyDecision } from '@models/penalty-decision';
import { PenaltyDecisionService } from '@services/penalty-decision.service';

@Component({
  selector: 'app-offenders-violations-preview',
  templateUrl: './offenders-violations-preview.component.html',
  styleUrls: ['./offenders-violations-preview.component.scss'],
  standalone: true,
  imports: [CommonModule, IconButtonComponent, MatMenuModule, MatSortModule, MatTableModule, MatTooltipModule],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0', display: 'none' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class OffendersViolationsPreviewComponent extends OnDestroyMixin(class { }) implements OnInit {
  lang = inject(LangService);
  dialog = inject(DialogService);
  lookupService = inject(LookupService);
  employeeService = inject(EmployeeService);
  offenderService = inject(OffenderService);
  penaltyDecisionService = inject(PenaltyDecisionService);
  offenderTypes = OffenderTypes;
  taskResponses = TaskResponses;
  systemPenalties = SystemPenalties;
  offenderDataSource = new AppTableDataSource<Offender>([]);
  reload$: Subject<void> = new Subject<void>();
  view$: Subject<Offender> = new Subject<Offender>();
  makeDecision$ = new Subject<Offender>();
  attachments$: Subject<Offender> = new Subject<Offender>();
  penaltyMap!: { [key: string]: { first: unknown; second: Penalty[] } };
  assignmentToAttend$: Subject<Offender> = new Subject<Offender>();
  situationSearch$ = new Subject<{ offender: Offender; isCompany: boolean }>();
  extendSuspendEmployee$ = new Subject<{ offender: Offender }>();
  suspendEmployee$ = new Subject<{ offender: Offender }>();
  referralOrTerminateDecission$ = new Subject<{
    offender: Offender; penaltyId: number | undefined
  }>();

  @Input({ required: true }) set data(offenders: Offender[]) {
    this.offenderDataSource = new AppTableDataSource(offenders);
  }
  @Input() investigationModel?: Investigation;
  @Input() isClaimed = false;
  offenderDisplayedColumns = ['arName', 'enName', 'offenderType', 'qid', 'jobTitle', 'departmentCompany', 'attachments', 'situationSearch', 'actions'];
  ViolationsDisplayedColumns = ['violationClassification', 'violationType', 'violationData', 'repeat'];
  offenderTypesMap: Record<number, Lookup> = this.lookupService.lookups.offenderType.reduce(
    (acc, item) => ({
      ...acc,
      [item.lookupKey]: item,
    }),
    {}
  );
  ngOnInit(): void {
    if(this.employeeService.hasPermissionTo('MANAGE_OFFENDER_VIOLATION')) {
      this.loadPenalties();
    }
    this.listenToView();
    this.listenToMakeDecision();
    this.listenToAttachments();
    this.listenToAssignmentToAttend();
    this.listenToSituationSearch();
    this.listenToReferralRequest();
    this.listenToSuspendEmployee();
  }
  getFilteredPenalties(offender: Offender) {
    return ((this.penaltyMap && this.penaltyMap[offender.id]) ? this.penaltyMap[offender.id].second : [])
      .filter(
        penalty =>
          penalty.penaltyKey !== SystemPenalties.TERMINATE &&
          penalty.penaltyKey !== SystemPenalties.REFERRAL_TO_PRESIDENT &&
          penalty.penaltyKey !== SystemPenalties.REFERRAL_TO_PRESIDENT_ASSISTANT
      )
  }
  getPenaltyIdByPenaltyKey(element: Offender, penaltyKey: SystemPenalties) {
    return this.penaltyMap && this.penaltyMap[element.id].second.find(penalty => penalty.penaltyKey == penaltyKey)?.id
  }
  private loadPenalties() {
    this.investigationModel
      ?.getService()
      .getCasePenalty(this.investigationModel?.id as string)
      .subscribe(data => {
        this.penaltyMap = data;
      });
  }
  private listenToView() {
    this.view$
      .pipe(
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
      .pipe(
        tap((offender: Offender) => {
          console.log(this.getFilteredPenalties(offender))
          !this.getFilteredPenalties(offender).length && this.dialog.info(this.lang.map.no_records_to_display)
        }),
        filter((offender: Offender) => !!this.getFilteredPenalties(offender).length)
      )
      .pipe(
        switchMap((offender: Offender) =>
          this.dialog
            .open(MakePenaltyDecisionPopupComponent, {
              data: {
                model: offender,
                caseId: this.investigationModel?.id,
                penalties: this.getFilteredPenalties(offender),
                penaltyImposedBySystem: this.penaltyMap[offender.id].first
              },
            })
            .afterClosed()
        )
      )
      .subscribe();
  }
  private listenToAssignmentToAttend() {
    this.assignmentToAttend$
      .pipe(
        switchMap((offender: Offender) =>
          this.dialog
            .open(AssignmentToAttendPopupComponent, {
              data: {
                offender: offender,
                caseId: this.investigationModel?.id,
                type: UserTypes.INTERNAL,
              },
            })
            .afterClosed()
        )
      )
      .subscribe();
  }
  private listenToSuspendEmployee() {
    this.suspendEmployee$
      .pipe(switchMap((offender) => {
        return this.dialog.open(SusbendEmployeePopupComponent, {
          data: {
            caseId: this.investigationModel?.id,
            offender
          }
        })
          .afterClosed()
      }))
      .subscribe();
  }
  isClearingAgent(element: Offender) {
    return element.type === OffenderTypes.ClEARING_AGENT;
  }
  listenToSituationSearch() {
    this.situationSearch$
      .pipe(
        switchMap((data: { offender: Offender; isCompany: boolean }) =>
          this.dialog
            .open(SituationSearchComponent, {
              data: {
                id: data.offender.offenderInfo?.id,
                type: data.offender.type,
                isCompany: data.isCompany,
              },
            })
            .afterClosed()
        )
      )
      .subscribe();
  }
  listenToReferralRequest() {
    this.referralOrTerminateDecission$
      .pipe(takeUntil(this.destroy$))
      .pipe(
        // preview form and confirm depend on form response
        // exhaustMap((payload) => {
          // return this.dialog.confirm(this.lang.map.confirm_take_penalty_decission)
          //   .afterClosed()
          //   .pipe(filter((click: any) => click == UserClick.YES))
          //   .pipe(map(() => payload))
        // })
      )
      .pipe(
        switchMap(({ offender, penaltyId }) => {
          return this.penaltyDecisionService.create(
            new PenaltyDecision().clone<PenaltyDecision>({
              caseId: this.investigationModel?.id,
              offenderId: offender.id,
              signerId: this.employeeService.getEmployee()?.id,
              penaltyId: penaltyId,
              status: 1,
            })
          );
        })
      )
      .subscribe();
  }
  canMakeDecision(offender: Offender): boolean {
    return this.penaltyMap && this.penaltyMap[offender.id] && !!this.getFilteredPenalties(offender).length && this.employeeService.hasPermissionTo('MANAGE_OFFENDER_VIOLATION');
  }
}
