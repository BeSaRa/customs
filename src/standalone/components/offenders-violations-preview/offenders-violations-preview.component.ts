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
  effect,
  EventEmitter,
  inject,
  Input,
  input,
  OnInit,
  signal,
  untracked,
} from '@angular/core';
import { IconButtonComponent } from '../icon-button/icon-button.component';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { LangService } from '@services/lang.service';
import { Lookup } from '@models/lookup';
import { LookupService } from '@services/lookup.service';
import { Offender } from '@models/offender';
import {
  filter,
  iif,
  merge,
  of,
  shareReplay,
  Subject,
  switchMap,
  takeUntil,
  tap,
} from 'rxjs';
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
import { MatMenuModule } from '@angular/material/menu';
import { SystemPenalties } from '@enums/system-penalties';
import { SuspendedEmployeeService } from '@services/suspended-employee.service';
import { PenaltyDecision } from '@models/penalty-decision';
import { SuspendEmployeePopupComponent } from '@standalone/popups/suspend-employee-popup/suspend-employee-popup.component';
import { ManagerDecisions } from '@enums/manager-decisions';
import { OffenderViolation } from '@models/offender-violation';
import { PenaltyDecisionService } from '@services/penalty-decision.service';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { AppIcons } from '@constants/app-icons';
import { DecisionMakerComponent } from '@standalone/components/decision-maker/decision-maker.component';
import { SelectInputComponent } from '@standalone/components/select-input/select-input.component';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { catchError, map, take } from 'rxjs/operators';
import { ToastService } from '@services/toast.service';
import { UserClick } from '@enums/user-click';
import { MatCheckbox } from '@angular/material/checkbox';
import { SelectionModel } from '@angular/cdk/collections';
import { intersection } from '@utils/utils';
import { PenaltyIcons } from '@constants/penalty-icons';
import { PenaltyDecisionContract } from '@contracts/penalty-decision-contract';
import { SituationSearchBtnComponent } from '@modules/electronic-services/components/situation-search-btn/situation-search-btn.component';
import { ProofTypes } from '@enums/proof-types';
import { OpenFrom } from '@enums/open-from';
import { OffenderStatusEnum } from '@enums/offender-status.enum';
import { OffenderInvStatus } from '@enums/offender-inv-status';
import { MatDialogClose } from '@angular/material/dialog';
import { ModifiedPenaltyComponent } from '@modules/electronic-services/components/modified-penalty/modified-penalty.component';
import { ActivitiesName } from '@enums/activities-name';
import { InvestigationService } from '@services/investigation.service';

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
    DecisionMakerComponent,
    SelectInputComponent,
    ReactiveFormsModule,
    MatCheckbox,
    SituationSearchBtnComponent,
    MatDialogClose,
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
  @Input() openFrom: OpenFrom = OpenFrom.ADD_SCREEN;
  protected readonly AppIcons = AppIcons;
  updateModel = input.required<EventEmitter<void>>();
  penaltyDecisionService = inject(PenaltyDecisionService);
  lang = inject(LangService);
  dialog = inject(DialogService);
  lookupService = inject(LookupService);
  employeeService = inject(EmployeeService);
  investigationService = inject(InvestigationService);
  suspendedEmployeeService = inject(SuspendedEmployeeService);
  offenderTypes = OffenderTypes;
  reload$: Subject<void> = new Subject<void>();
  view$: Subject<Offender> = new Subject<Offender>();
  makeDecision$ = new Subject<Offender>();
  attachments$: Subject<Offender> = new Subject<Offender>();
  assignmentToAttend$: Subject<Offender> = new Subject<Offender>();
  suspendEmployee$ = new Subject<{ offender: Offender }>();
  revokeReferralRequest$: Subject<Offender> = new Subject<Offender>();
  revokeReferral$: Subject<Offender> = new Subject<Offender>();

  // referralOrTerminateDecision$ = new Subject<{
  //   offender: Offender;
  //   penaltyId: number | undefined;
  // }>();

  selectedOffender!: Offender | null;
  toast = inject(ToastService);
  proofStatus = this.lookupService.lookups.proofStatus
    .slice()
    .sort((a, b) => a.lookupKey - b.lookupKey);

  model = input.required<Investigation>();
  isClaimed = input(false, { transform: booleanAttribute });
  selection = new SelectionModel<Offender>(true);
  offenderDisplayedColumns = [
    'arrows',
    'offenderName',
    'qid',
    'departmentCompany',
    'violations',
    'offenderStatus',
    'situationSearch',
    'decision',
    'actions',
  ];
  isClaimedEffect = effect(() => {
    if (this.isClaimed()) {
      this.offenderDisplayedColumns = [
        'arrows',
        'select',
        ...this.offenderDisplayedColumns.filter(
          column => column !== 'select' && column !== 'arrows',
        ),
      ];
    } else {
      this.offenderDisplayedColumns = [
        'arrows',
        ...this.offenderDisplayedColumns.filter(
          column => column !== 'select' && column !== 'arrows',
        ),
      ];
    }
  });
  penaltyIcons = PenaltyIcons;
  offenderTypesMap: Record<number, Lookup> =
    this.lookupService.lookups.offenderType.reduce((acc, item) => {
      return {
        ...acc,
        [item.lookupKey]: item,
      };
    }, {});
  loadPenalties$ = new Subject<void>();
  penaltiesLoaded$ = this.loadPenalties$
    .pipe(
      filter(
        () => this.canLoadPenalties() || this.openFrom === OpenFrom.SEARCH,
      ),
    )
    .pipe(switchMap(() => this.loadPenalties()))
    .pipe(takeUntil(this.destroy$))
    .pipe(tap(data => this.penaltyMap.set(data)))
    .pipe(shareReplay(1));

  offenders = computed(() => {
    let offendersList = [];

    if (
      (this.employeeService.isHumanResourceTeam() ||
        this.employeeService.isCustomsAffairsManager() ||
        this.employeeService.isCustomsAffairs()) &&
      !this.model().isDrafted &&
      this.openFrom !== OpenFrom.SEARCH
    ) {
      offendersList = this.model().getConcernedOffenders();
    } else {
      const offendersIds = this.model().offenderViolationInfo.map(
        i => i.offenderId,
      );
      offendersList = this.model().offenderInfo.filter(offender => {
        return offendersIds.includes(offender.id);
      });
    }

    return offendersList.sort((a, b) => {
      const isAHighlighted = this.isHighlighted(a);
      const isBHighlighted = this.isHighlighted(b);

      if (isAHighlighted && !isBHighlighted) return -1;
      if (!isAHighlighted && isBHighlighted) return 1;
      return 0;
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

  decisionMap = computed(() => {
    return this.model().penaltyDecisions.reduce<
      Record<number, PenaltyDecision>
    >((acc, item) => {
      return { ...acc, [item.offenderId]: item };
    }, {});
  });

  violationProofStatus = computed(() => {
    return Object.entries(this.offenderViolationsMap()).reduce<
      Record<number, FormControl<number | null>[]>
    >((acc, [key, offenderViolation]) => {
      const decision = untracked(this.decisionMap)[Number(key)];
      acc[Number(key)] = offenderViolation.map(
        i =>
          new FormControl<number>({
            value: i.proofStatus,
            disabled:
              !this.penaltyMap()[i.offenderId] ||
              (decision &&
                decision.penaltyInfo &&
                decision.penaltyInfo.penaltyKey === SystemPenalties.TERMINATE &&
                !this.model().inSubmitInvestigationActivity()) ||
              this.model().inHumanResource() ||
              this.model().inLegalAffairsActivity() ||
              !this.model().hasTask() ||
              !this.model().inMyInbox() ||
              (this.isMandatoryToRequestReferral(key as unknown as number) &&
                !(
                  this.employeeService.isPresident() ||
                  this.employeeService.isPresidentAssisstant()
                )) ||
              ((this.employeeService.isPresident() ||
                this.employeeService.isPresidentAssisstant()) &&
                i.offenderInfo.status ===
                  OffenderInvStatus.INVESTIGATION_POSTPONED) ||
              (this.model().hasConcernedOffenders() &&
                !this.model().isOffenderConcerned(i.offenderId)),
          }),
      );
      return acc;
    }, {});
  });

  isMandatoryToRequestReferral(offenderId: number) {
    return (
      this.penaltyMap()[offenderId]?.first ===
      ManagerDecisions.IT_IS_MANDATORY_TO_REQUEST_A_REFERRAL
    );
  }

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
  selectionChange = signal<Offender[]>([]);
  uniqSystemPenalties = computed(() => {
    const offenderIds = this.selectionChange().map(item => item.id);
    const arrayOfSystemPenalties = offenderIds.map(item => {
      return (
        this.penaltyMap()[item]
          ? this.penaltyMap()[item].second
          : ([] as Penalty[])
      ).filter(i => i.isSystem);
    });
    const penalties = arrayOfSystemPenalties.flat();
    return penalties.reduce<Record<number, Penalty>>((acc, item) => {
      return { ...acc, [item.penaltyKey]: item };
    }, {});
  });
  commonPenalties = computed<Penalty[]>(() => {
    const offenderIds = this.selectionChange().map(item => item.id);
    const offendersSystemPenaltiesKeys = offenderIds.map(item => {
      return (
        this.penaltyMap()[item]
          ? this.penaltyMap()[item].second
          : ([] as Penalty[])
      )
        .filter(i => i.isSystem)
        .map(i => i.penaltyKey);
    });

    return offendersSystemPenaltiesKeys.length === 1
      ? offendersSystemPenaltiesKeys
          .flat()
          .map(key => this.uniqSystemPenalties()[key])
      : intersection(offendersSystemPenaltiesKeys).map(
          key => this.uniqSystemPenalties()[key],
        );
  });

  penaltyMap = signal<
    Record<number, { first: number | null; second: Penalty[] }>
  >({});

  penalties = computed(() => {
    return Object.keys(this.penaltyMap()).reduce<
      Record<string, PenaltyDecisionContract>
    >((acc, offenderId) => {
      if (!acc[offenderId]) {
        acc[offenderId] = {
          managerDecisionControl: this.penaltyMap()[Number(offenderId)].first,
          system: this.penaltyMap()[Number(offenderId)].second.filter(
            p => p.isSystem,
          ),
          normal: this.penaltyMap()[Number(offenderId)].second.filter(
            p => !p.isSystem,
          ),
        };
      }
      return { ...acc };
    }, {});
  });

  isMandatoryToImposePenalty = computed(() => {
    return Object.keys(this.penaltyMap()).some(key => {
      return (
        this.penaltyMap()[Number(key)].first ===
        ManagerDecisions.IT_IS_MANDATORY_TO_IMPOSE_A_PENALTY
      );
    });
  });

  selectedSystemAction$ = new Subject<SystemPenalties>();

  systemPenaltiesMap = {
    [SystemPenalties.REFERRAL_TO_PRESIDENT]:
      this.penaltyDecisionService.openRequestReferralDialog,
    [SystemPenalties.REFERRAL_TO_PRESIDENT_ASSISTANT]:
      this.penaltyDecisionService.openRequestReferralDialog,
    [SystemPenalties.TERMINATE]:
      this.penaltyDecisionService.openTerminateDialog,
    [SystemPenalties.REFERRAL_DISCIPLINARY_COMMITTEE]:
      this.penaltyDecisionService.openRequestReferralDialog,
    [SystemPenalties.REFERRAL_TO_PERMANENT_DISCIPLINARY_COUNCIL]:
      this.penaltyDecisionService.openRequestReferralDialog,
    [SystemPenalties.REFERRAL_TO_LEGAL_AFFAIRS]:
      this.penaltyDecisionService.openRequestReferralDialog,
  };

  isSomeOffenderViolationsProofed(offenderId: number) {
    return this.violationProofStatus()[offenderId].some(
      c => c.value === ProofTypes.PROVED,
    );
  }

  canMakeSystemDecision(offenderId: number): boolean {
    return !!(
      (
        this.penalties() &&
        this.penalties()[offenderId] &&
        this.penalties()[offenderId].system.length &&
        (!this.model().hasConcernedOffenders() ||
          (this.model().hasConcernedOffenders() &&
            this.model().isOffenderConcerned(offenderId)))
      ) /*&&
      this.employeeService.hasPermissionTo('MANAGE_OFFENDER_VIOLATION')*/
    );
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.offenders().filter(i =>
      this.canMakeSystemDecision(i.id),
    ).length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  toggleAllRows() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.offenders().forEach(row => {
          this.canMakeSystemDecision(row.id)
            ? this.selection.select(row)
            : null;
        });
  }

  ngOnInit(): void {
    this.listenToView();
    this.listenToRevokeReferralActions();
    this.listenToMakeDecision();
    this.listenToAttachments();
    this.listenToAssignmentToAttend();
    // this.listenToReferralRequest();
    this.listenToSuspendEmployee();
    this.listenToLoadPenalties();
    this.loadPenalties$.next();
    this.selection.changed.subscribe(() => {
      this.selectionChange.set(this.selection.selected);
    });
    this.listenToSelectedSystemAction();
  }

  assertType(item: Offender): Offender {
    return new Offender().clone<Offender>(item);
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
  private listenToRevokeReferralActions() {
    merge(
      this.revokeReferralRequest$.pipe(map(() => true)),
      this.revokeReferral$.pipe(map(() => false)),
    )
      .pipe(takeUntil(this.destroy$))
      .subscribe(isRequest => {
        this.investigationService
          .referralWithdrawalAction(this.model().id, isRequest)
          .pipe(takeUntil(this.destroy$))
          .subscribe(() => {
            const message = isRequest
              ? this.lang.map.revoke_referral_request_success
              : this.lang.map.revoke_referral_success;
            this.dialog.success(message);
          });
      });
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
        this.model &&
          item &&
          (() => {
            this.model().getPenaltyDecisionByOffenderId(item.offenderId);
            this.model().appendPenaltyDecision(item);
          })();
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

  getOffenderDecision(offenderId: number): PenaltyDecision | undefined {
    return this.decisionMap() && this.decisionMap()[offenderId]
      ? this.decisionMap()[offenderId]
      : undefined;
  }

  private listenToLoadPenalties() {
    this.penaltiesLoaded$.subscribe();
  }

  private canLoadPenalties(): boolean {
    return !!(
      this.model() &&
      this.model().hasTask() && // next 2 conditions to make sure to not run this code for case without task and activityName
      this.model().getActivityName() &&
      this.model().getTaskName() &&
      !this.model().inLegalAffairsActivity()
    );
  }

  private loadPenalties() {
    return this.model()
      ? this.model()
          .getService()
          .getCasePenalty(
            this.model().id as string,
            this.openFrom === OpenFrom.SEARCH
              ? ActivitiesName.REVIEW_PENALTY_MODIFICATION
              : this.model().getActivityName()!,
          )
          .pipe(
            catchError(() => {
              return of(
                {} as Record<
                  string,
                  { first: ManagerDecisions; second: Penalty[] }
                >,
              );
            }),
          )
      : of(
          {} as Record<string, { first: ManagerDecisions; second: Penalty[] }>,
        );
  }

  proofStatusChanged(item: OffenderViolation, index: number) {
    const oldValue = this.violationProofStatus()[item.offenderId][index].value!;
    of(this.decisionMap()[item.offenderId])
      .pipe(takeUntil(this.destroy$))
      .pipe(
        switchMap(penaltyDecision =>
          iif(
            () => this.model().inSubmitInvestigationActivity(),
            of(true).pipe(
              switchMap(() => this.displayConfirmMessage(penaltyDecision)),
              tap(({ click }) => {
                this.resetProofStatusToOldValue(click, item, index, oldValue);
              }),
              filter(({ click }) => click === UserClick.YES),
              switchMap(({ penaltyDecision }) => {
                return this.deleteOldDecision(penaltyDecision);
              }),
            ),
            of(false),
          ),
        ),
      )
      .subscribe(() => {
        this.updateOffenderViolationProofStatus(item, index);
      });
  }

  private updateOffenderViolationProofStatus(
    item: OffenderViolation,
    index: number,
  ) {
    Promise.resolve().then(() => {
      item.proofStatus =
        this.violationProofStatus()[item.offenderId][index].value!;
      const violationIndex = this.model().offenderViolationInfo.findIndex(i => {
        return i === item;
      });

      item
        .update()
        .pipe(takeUntil(this.destroy$), take(1))
        .subscribe(model => {
          this.model().offenderViolationInfo.splice(violationIndex, 1, model);
          this.updateModel().emit();
          this.toast.success(
            this.lang.map.is_proved_status_updated_successfully,
          );
          this.loadPenalties$.next();
        });
    });
  }

  private deleteOldDecision(penaltyDecision: PenaltyDecision | null) {
    return penaltyDecision
      ? penaltyDecision
          .delete()
          .pipe(tap(() => this.model().removePenaltyDecision(penaltyDecision)))
      : of(null);
  }

  private resetProofStatusToOldValue(
    click: UserClick | undefined,
    item: OffenderViolation,
    index: number,
    oldValue: number,
  ) {
    if (click !== UserClick.YES) {
      this.violationProofStatus()[item.offenderId][index].patchValue(oldValue, {
        emitEvent: false,
      });
    }
  }

  private displayConfirmMessage(penaltyDecision: null | PenaltyDecision) {
    return penaltyDecision
      ? this.dialog
          .confirm(this.lang.map.action_will_effect_current_offender_decision)
          .afterClosed()
          .pipe(
            map(click => {
              return { click, penaltyDecision };
            }),
          )
      : of({ click: UserClick.YES, penaltyDecision });
  }

  getPenaltyIcon(penaltyKey: SystemPenalties) {
    return (
      this.penaltyIcons[penaltyKey] ||
      this.penaltyIcons[SystemPenalties.TERMINATE] // default icon
    );
  }

  private listenToSelectedSystemAction() {
    this.selectedSystemAction$
      .pipe(takeUntil(this.destroy$))
      .pipe(map(value => this.uniqSystemPenalties()[value]))
      .subscribe(selectedPenalty => {
        // TODO: refactor later to good way
        type PenaltyKey = typeof this.systemPenaltiesMap;
        const method =
          this.systemPenaltiesMap[
            selectedPenalty.penaltyKey as unknown as keyof PenaltyKey
          ];

        method
          .call(
            this.penaltyDecisionService,
            this.selection.selected,
            this.model,
            this.updateModel,
            selectedPenalty,
          )
          .afterClosed()
          .subscribe(() => {
            this.selection.clear();
          });
      });
  }

  isHighlighted(offender: Offender): boolean {
    return [
      OffenderStatusEnum.THE_PENALTY_WAS_IMPOSED,
      OffenderStatusEnum.TERMINATE,
      OffenderStatusEnum.SAVED,
    ].includes(offender.status);
  }

  showModificationPenalties($event: MouseEvent, element: Offender) {
    $event.stopPropagation();
    $event.preventDefault();
    this.dialog.open(ModifiedPenaltyComponent, {
      data: { offenderId: element.id },
    });
  }

  isPenaltyModified(element: Offender) {
    return (
      element.status === OffenderStatusEnum.UNDER_MODIFICATION ||
      element.status === OffenderStatusEnum.PENALTY_MODIFIED
    );
  }

  canMakePenaltyModification(offender: Offender) {
    return (
      !!offender.decisionSerial &&
      offender.status !== OffenderStatusEnum.PENALTY_UPDATED &&
      this.openFrom === OpenFrom.SEARCH &&
      this.employeeService.hasPermissionTo(
        'CREATE_PENALTY_MODIFICATION_REQUEST',
      )
    );
  }

  underModification(offender: Offender) {
    return (
      offender.id === this.model().concernedOffenderId() &&
      this.model().isModificationPenaltyCase()
    );
  }

  isDecisionEnabled(element: Offender) {
    return this.notUnderModificationOnModificationCase(element)
      ? false
      : (this.isClaimed() &&
          (!this.model().isModificationPenaltyCase() ||
            this.underModification(element))) ||
          (!this.isClaimed() && this.canMakePenaltyModification(element));
  }

  notUnderModificationOnModificationCase(element: Offender): boolean {
    return (
      this.model().getActivityName() ===
        ActivitiesName.REVIEW_PENALTY_MODIFICATION &&
      element.status !== OffenderStatusEnum.UNDER_MODIFICATION
    );
  }

  showRevokeReferralRequest(element: Offender) {
    return (
      this.openFrom === OpenFrom.SEARCH &&
      (element.status ===
        OffenderStatusEnum.REFERRED_TO_THE_ASSISTANT_PRESIDENT ||
        element.status ===
          OffenderStatusEnum.REFERRED_TO_THE_ASSISTANT_PRESIDENT_ASSISTANT)
    );
  }
  showRevokeReferral(element: Offender) {
    return (
      this.openFrom === OpenFrom.SEARCH &&
      element.status === OffenderStatusEnum.REFERRED_TO_LEGAL_AFFAIRS
    );
  }
}
