import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { CommonModule } from '@angular/common';
import {
  booleanAttribute,
  Component,
  computed,
  EventEmitter,
  inject,
  input,
  OnInit,
  signal,
} from '@angular/core';
import { IconButtonComponent } from '../icon-button/icon-button.component';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { LangService } from '@services/lang.service';
import { Lookup } from '@models/lookup';
import { LookupService } from '@services/lookup.service';
import { Offender } from '@models/offender';
import { filter, of, Subject, switchMap, takeUntil } from 'rxjs';
import { OffenderViolationsPopupComponent } from '@standalone/popups/offender-violations-popup/offender-violations-popup.component';
import { DialogService } from '@services/dialog.service';
import { OffenderAttachmentPopupComponent } from '@standalone/popups/offender-attachment-popup/offender-attachment-popup.component';
import { Investigation } from '@models/investigation';
import { EmployeeService } from '@services/employee.service';
import { MakePenaltyDecisionPopupComponent } from '@standalone/popups/make-penalty-decision-popup/make-penalty-decision-popup.component';
import { Penalty } from '@models/penalty';
import { OnDestroyMixin } from '@mixins/on-destroy-mixin';
import { AssignmentToAttendPopupComponent } from '../assignment-to-attend-popup/assignment-to-attend-popup.component';
import { UserTypes } from '@enums/user-types';
import { OffenderTypes } from '@enums/offender-types';
import { SituationSearchComponent } from '@modules/electronic-services/components/situation-search/situation-search.component';
import { MatMenuModule } from '@angular/material/menu';
import { SystemPenalties } from '@enums/system-penalties';
import { SuspendedEmployeeService } from '@services/suspended-employee.service';
import { PenaltyDecision } from '@models/penalty-decision';
import { SuspendEmployeePopupComponent } from '@standalone/popups/suspend-employee-popup/suspend-employee-popup.component';
import { ManagerDecisions } from '@enums/manager-decisions';
import { OffenderViolation } from '@models/offender-violation';
import { PenaltyDecisionService } from '@services/penalty-decision.service';
import { PenaltyService } from '@services/penalty.service';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { AppIcons } from '@constants/app-icons';

@Component({
  selector: 'app-offenders-violations-preview',
  templateUrl: './offenders-violations-preview.component.html',
  styleUrls: ['./offenders-violations-preview.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IconButtonComponent,
    MatMenuModule,
    MatSortModule,
    MatTableModule,
    MatTooltipModule,
    MatIconButton,
    MatIcon,
  ],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition(
        'expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)'),
      ),
    ]),
  ],
})
export class OffendersViolationsPreviewComponent
  extends OnDestroyMixin(class {})
  implements OnInit
{
  protected readonly AppIcons = AppIcons;
  updateModel = input.required<EventEmitter<void>>();
  penaltyDecisionService = inject(PenaltyDecisionService);
  lang = inject(LangService);
  dialog = inject(DialogService);
  lookupService = inject(LookupService);
  employeeService = inject(EmployeeService);
  suspendedEmployeeService = inject(SuspendedEmployeeService);
  offenderTypes = OffenderTypes;
  systemPenalties = SystemPenalties;
  reload$: Subject<void> = new Subject<void>();
  view$: Subject<Offender> = new Subject<Offender>();
  makeDecision$ = new Subject<Offender>();
  attachments$: Subject<Offender> = new Subject<Offender>();
  penaltyMap = signal<
    Record<string, { first: ManagerDecisions; second: Penalty[] }>
  >({});
  assignmentToAttend$: Subject<Offender> = new Subject<Offender>();
  situationSearch$ = new Subject<{ offender: Offender; isCompany: boolean }>();
  suspendEmployee$ = new Subject<{ offender: Offender }>();
  referralOrTerminateDecision$ = new Subject<{
    offender: Offender;
    penaltyId: number | undefined;
  }>();

  selectedOffender!: Offender | null;

  model = input.required<Investigation>();

  isClaimed = input(false, { transform: booleanAttribute });

  offenderDisplayedColumns = [
    'offenderName',
    'qid',
    'departmentCompany',
    'violations',
    'situationSearch',
    'decision',
    'actions',
  ];

  offenderTypesMap: Record<number, Lookup> =
    this.lookupService.lookups.offenderType.reduce((acc, item) => {
      return {
        ...acc,
        [item.lookupKey]: item,
      };
    }, {});

  private loadPenalties$ = new Subject<void>();
  offenders = computed(() => {
    const offendersIds = this.model().offenderViolationInfo.map(
      i => i.offenderId,
    );
    return this.model().offenderInfo.filter(offender => {
      return offendersIds.includes(offender.id);
    });
  });

  offenderViolationsMap = computed(() => {
    return this.model().offenderViolationInfo.reduce<
      Record<number, OffenderViolation[]>
    >((acc, current) => {
      if (!Object.prototype.hasOwnProperty.call(acc, current.offenderId)) {
        acc[current.offenderId] = [];
      }
      acc[current.offenderId] = [...acc[current.offenderId], current];
      return { ...acc };
    }, {});
  });

  offenderViolationsSlices = computed(() => {
    const keys = Object.keys(this.offenderViolationsMap());
    return keys.reduce<Record<number, OffenderViolation[]>>(
      (acc, offenderId: string) => {
        if (!Object.prototype.hasOwnProperty.call(acc, offenderId)) {
          acc[Number(offenderId)] = this.offenderViolationsMap()[
            Number(offenderId)
          ].slice(0, 3);
        }
        return { ...acc };
      },
      {},
    );
  });

  decisionMap = computed(() => {
    return this.model().taskDetails?.penaltyDecisions.reduce<
      Record<number, PenaltyDecision>
    >((acc, item) => {
      return { ...acc, [item.offenderId]: item };
    }, {});
  });

  penaltyService = inject(PenaltyService);

  situationClick(
    $event: MouseEvent,
    element: Offender,
    isCompany: boolean,
  ): void {
    $event.stopPropagation();
    $event.preventDefault();
    this.situationSearch$.next({ offender: element, isCompany });
  }

  ngOnInit(): void {
    this.listenToLoadPenalties();
    this.listenToView();
    this.listenToMakeDecision();
    this.listenToAttachments();
    this.listenToAssignmentToAttend();
    this.listenToSituationSearch();
    this.listenToReferralRequest();
    this.listenToSuspendEmployee();
    this.loadPenalties$.next();
  }

  assertType(item: Offender): Offender {
    return item;
  }

  getOffenderPenalties(offender: Offender) {
    return this.penaltyMap() && this.penaltyMap()[offender.id]
      ? this.penaltyMap()[offender.id].second
      : [];
  }

  getPenaltyIdByPenaltyKey(element: Offender, penaltyKey: SystemPenalties) {
    return (
      this.penaltyMap &&
      this.penaltyMap()[element.id] &&
      this.penaltyMap()[element.id].second.find(
        penalty => penalty.penaltyKey === penaltyKey,
      )?.id
    );
  }

  private loadPenalties() {
    return this.model()
      ? this.model()
          .getService()
          .getCasePenalty(
            this.model().id as string,
            this.model().getActivityName()!,
          )
      : of(
          {} as Record<string, { first: ManagerDecisions; second: Penalty[] }>,
        );
  }

  private listenToView() {
    this.view$
      .pipe(
        switchMap((offender: Offender) =>
          this.dialog
            .open(OffenderViolationsPopupComponent, {
              data: {
                offender: offender,
                model: this.model,
                readonly: true,
              },
            })
            .afterClosed(),
        ),
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
                model: this.model,
                offenderId: model.id,
                readonly: true,
              },
            })
            .afterClosed(),
        ),
      )
      .subscribe();
  }

  private listenToMakeDecision() {
    this.makeDecision$
      .pipe(
        switchMap((offender: Offender) =>
          this.dialog
            .open<unknown, unknown, PenaltyDecision>(
              MakePenaltyDecisionPopupComponent,
              {
                data: {
                  model: offender,
                  caseId: this.model().id,
                  penalties: this.getOffenderPenalties(offender),
                  penaltyImposedBySystem: this.penaltyMap()[offender.id].first,
                  oldPenalty: this.model().getPenaltyDecisionByOffenderId(
                    offender.id,
                  ),
                },
              },
            )
            .afterClosed(),
        ),
      )
      .subscribe((item: PenaltyDecision | undefined) => {
        this.model && item && this.model().appendPenaltyDecision(item);
        console.log(this.model());
      });
  }

  private listenToAssignmentToAttend() {
    this.assignmentToAttend$
      .pipe(
        switchMap((offender: Offender) =>
          this.dialog
            .open(AssignmentToAttendPopupComponent, {
              data: {
                offender: offender,
                caseId: this.model().id,
                type: UserTypes.INTERNAL,
              },
            })
            .afterClosed(),
        ),
      )
      .subscribe();
  }

  private listenToSuspendEmployee() {
    this.suspendEmployee$
      .pipe(
        switchMap(offender => {
          const suspendedEmployee =
            this.suspendedEmployeeService.ConvertOffenderToSuspendedEmployee(
              offender.offender,
              this.model().id as string,
            );
          return this.dialog
            .open(SuspendEmployeePopupComponent, {
              data: suspendedEmployee,
            })
            .afterClosed();
        }),
      )
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
            .afterClosed(),
        ),
      )
      .subscribe();
  }

  listenToReferralRequest() {
    this.referralOrTerminateDecision$
      .pipe(takeUntil(this.destroy$))
      .pipe(
        switchMap(({ offender, penaltyId }) => {
          const penaltyDecision = new PenaltyDecision().clone<PenaltyDecision>({
            caseId: this.model().id,
            offenderId: offender.id,
            signerId: this.employeeService.getEmployee()?.id,
            penaltyId: penaltyId,
            status: 1,
          });
          return penaltyDecision.save();
        }),
      )
      .subscribe();
  }

  canMakeDecision(offender: Offender): boolean {
    return (
      this.penaltyMap() &&
      this.penaltyMap()[offender.id] &&
      !!this.getOffenderPenalties(offender).length &&
      this.employeeService.hasPermissionTo('MANAGE_OFFENDER_VIOLATION')
    );
  }

  mandatoryMakePenaltyDecisions() {
    return (
      !!this.penaltyMap() &&
      !!Object.keys(this.penaltyMap()).find(
        k =>
          this.penaltyMap()[k].first ===
          ManagerDecisions.IT_IS_MANDATORY_TO_IMPOSE_A_PENALTY,
      )
    );
  }

  private listenToLoadPenalties() {
    this.loadPenalties$
      .pipe(filter(() => this.canLoadPenalties()))
      .pipe(switchMap(() => this.loadPenalties()))
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.penaltyMap.set(data);
      });
  }

  canLoadPenalties(): boolean {
    return !!(
      this.model() &&
      this.model().hasTask() && // next 2 conditions to make sure to not run this code for case without task and activityName
      this.model().getActivityName() &&
      this.model().getTaskName()
    );
  }

  rowClicked($event: MouseEvent, element: Offender) {
    const requiredClassToPreventExpended = 'mat-mdc-button-touch-target';
    if (
      !($event.target as unknown as HTMLElement).classList.contains(
        requiredClassToPreventExpended,
      )
    ) {
      this.selectedOffender =
        this.selectedOffender === element ? null : element;
    }
  }

  getOffenderViolations(offenderId: number): OffenderViolation[] {
    return this.offenderViolationsMap()[offenderId] || [];
  }

  getOffenderViolationsSlice(offenderId: number): OffenderViolation[] {
    return this.offenderViolationsSlices()[offenderId] || [];
  }

  openDecisionDialog(element: Offender) {
    this.penaltyDecisionService.openSingleDecisionDialog(
      element,
      this.model,
      this.updateModel,
    );
  }

  getOffenderDecision(offenderId: number): PenaltyDecision | undefined {
    return this.decisionMap() && this.decisionMap()[offenderId]
      ? this.decisionMap()[offenderId]
      : undefined;
  }
}
