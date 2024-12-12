import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { NgClass } from '@angular/common';
import {
  Component,
  computed,
  inject,
  input,
  OnInit,
  signal,
} from '@angular/core';
import { MatIcon } from '@angular/material/icon';
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
} from '@angular/material/table';
import { MatTooltip } from '@angular/material/tooltip';
import { AppIcons } from '@constants/app-icons';
import { OffenderTypes } from '@enums/offender-types';
import { OnDestroyMixin } from '@mixins/on-destroy-mixin';
import { AdminResult } from '@models/admin-result';
import { CallRequest } from '@models/call-request';
import { Investigation } from '@models/investigation';
import { InvestigationReport } from '@models/investigation-report';
import { Lookup } from '@models/lookup';
import { Offender } from '@models/offender';
import { OffenderViolation } from '@models/offender-violation';
import { Witness } from '@models/witness';
import { CallRequestService } from '@services/call-request.service';
import { DialogService } from '@services/dialog.service';
import { EmployeeService } from '@services/employee.service';
import { InvestigationReportService } from '@services/investigation-report.service';
import { LangService } from '@services/lang.service';
import { LookupService } from '@services/lookup.service';
import { WitnessService } from '@services/witness.service';
import { ButtonComponent } from '@standalone/components/button/button.component';
import { CallRequestRecordsTableComponent } from '@standalone/components/call-request-records-table/call-request-records-table.component';
import { IconButtonComponent } from '@standalone/components/icon-button/icon-button.component';
import { InvestigationRecordsTableComponent } from '@standalone/components/investigation-records-table/investigation-records-table.component';
import { OffenderViolationsComponent } from '@standalone/components/offender-violations/offender-violations.component';
import { exhaustMap, Subject } from 'rxjs';
import { filter, map, switchMap, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-persons-list',
  standalone: true,
  imports: [
    MatTable,
    MatColumnDef,
    MatHeaderCell,
    MatCell,
    MatCellDef,
    MatHeaderCellDef,
    MatHeaderRow,
    MatRow,
    MatRowDef,
    MatHeaderRowDef,
    MatNoDataRow,
    ButtonComponent,
    IconButtonComponent,
    MatTooltip,
    MatIcon,
    OffenderViolationsComponent,
    InvestigationRecordsTableComponent,
    NgClass,
    CallRequestRecordsTableComponent,
  ],
  templateUrl: './persons-list.component.html',
  styleUrl: './persons-list.component.scss',
  animations: [
    trigger('expendCollapse', [
      state(
        'collapse',
        style({
          height: 0,
          minHeight: 0,
        }),
      ),
      state(
        'expend',
        style({
          height: '*',
          minHeight: '*',
        }),
      ),
      transition('collapse <=> expend', animate('200ms ease-in-out')),
    ]),
  ],
})
export class PersonsListComponent
  extends OnDestroyMixin(class {})
  implements OnInit
{
  protected readonly offenderTypes = OffenderTypes;
  lang = inject(LangService);
  lookupService = inject(LookupService);
  investigationReportService = inject(InvestigationReportService);
  callRequestService = inject(CallRequestService);
  witnessService = inject(WitnessService);
  model = input.required<Investigation>();
  fromCallRequestTab = input<boolean>(false);
  isOpenedFromSearch = input<boolean>(false);
  concernedOffenders = computed(() => {
    return (this.model() && this.model().getConcernedOffenders()) || [];
  });
  allOffenders = computed(() => {
    return (this.model() && this.model().offenderInfo) || [];
  });

  witness = signal<Witness[]>([]);

  models = computed(() => {
    return this.isOffender()
      ? this.fromCallRequestTab() ||
        ((this.employeeService.isDisciplinaryCommittee() ||
          this.employeeService.isOneOfLegalAffairsTeams()) &&
          this.isOpenedFromSearch())
        ? this.allOffenders()
        : this.concernedOffenders()
      : (this.witness() as unknown as Offender[]);
  });

  dialog = inject(DialogService);
  offenderViolationsMap = computed<Record<number, OffenderViolation[]>>(() => {
    return this.model().offenderViolationInfo.reduce(
      (acc, offenderViolation) => {
        return {
          ...acc,
          [offenderViolation.offenderId]: [
            ...(acc[offenderViolation.offenderId]
              ? [...acc[offenderViolation.offenderId], offenderViolation]
              : [offenderViolation]),
          ],
        };
      },
      {} as Record<number, OffenderViolation[]>,
    );
  });
  type = input.required<'offender' | 'witness'>();
  isOffender = computed(() => this.type() === 'offender');
  isWitness = computed(() => this.type() === 'witness');

  employeeService = inject(EmployeeService);
  displayedColumns = computed<string[]>(() => {
    const buttons = [];
    this.employeeService.hasPermissionTo('MANAGE_OBLIGATION_TO_ATTEND') &&
      buttons.push('call');
    this.employeeService.hasPermissionTo(
      'ADMINISTRATIVE_INVESTIGATION_REPORT',
    ) &&
      !this.fromCallRequestTab() &&
      buttons.push('investigation');
    return ([] as string[])
      .concat(
        this.isOffender()
          ? ['arrows', 'offenderName', 'qid', 'departmentCompany', 'jobGrade']
          : [
              'arrows',
              'witnessName',
              'witnessQid',
              'witnessType',
              'personType',
            ],
      )
      .concat(buttons);
  });
  reloadWitness$ = new Subject<void>();
  requestCall$ = new Subject<Offender | Witness>();
  requestInvestigation$ = new Subject<Offender | Witness>();

  reload$ = new Subject<{
    type: 'call' | 'investigation';
    offenderId?: number;
    witnessId?: number;
  }>();

  offenderTypesMap: Record<number, Lookup> =
    this.lookupService.lookups.offenderType.reduce((acc, item) => {
      return {
        ...acc,
        [item.lookupKey]: item,
      };
    }, {});

  selectedOffender?: Offender;

  protected readonly AppIcons = AppIcons;
  addWitness$: Subject<void> = new Subject<void>();

  ngOnInit(): void {
    this.listenToRequestCall();
    this.listenToRequestInvestigation();

    if (this.isWitness()) {
      this.listenToAddWitness();
      this.listenToReloadWitness();
      this.reloadWitness$.next();
    }
  }

  assertType(item: unknown): Offender {
    return item as Offender;
  }

  assertWitness(item: unknown): Witness {
    return item as Witness;
  }

  toggleOffender($event: MouseEvent, element: Offender) {
    if (($event.target as HTMLElement).nodeName === 'BUTTON') return;

    !this.selectedOffender
      ? (this.selectedOffender = element)
      : this.selectedOffender === element
        ? (this.selectedOffender = undefined)
        : (this.selectedOffender = element);
  }

  private listenToRequestCall() {
    this.requestCall$
      .pipe(takeUntil(this.destroy$))
      .pipe(
        switchMap(person => {
          return this.callRequestService
            .openCreateDialog(
              new CallRequest().clone<CallRequest>({
                createdByInfo: AdminResult.createInstance({
                  id: this.employeeService.getEmployee()?.id,
                  arName: this.employeeService.getEmployee()?.arName,
                  enName: this.employeeService.getEmployee()?.enName,
                }),
              }),
              {
                ...(this.isOffender()
                  ? { offender: person }
                  : { witness: person }),
                model: this.model(),
                caseId: this.model().id,
              },
            )
            .afterClosed()
            .pipe(map(() => person));
        }),
      )
      .subscribe(person => {
        this.reload$.next({
          type: 'call',
          ...(this.isOffender()
            ? { offenderId: person.id }
            : { witnessId: person.id }),
        });
      });
  }

  private listenToRequestInvestigation() {
    this.requestInvestigation$
      .pipe(takeUntil(this.destroy$))
      .pipe(
        switchMap(person =>
          this.investigationReportService
            .openCreateDialog(
              new InvestigationReport().clone<InvestigationReport>({
                createdBy: this.employeeService.getEmployee()?.id,
                creatorInfo: AdminResult.createInstance({
                  id: this.employeeService.getEmployee()?.id,
                  arName: this.employeeService.getEmployee()?.arName,
                  enName: this.employeeService.getEmployee()?.enName,
                }),
              }),
              {
                ...(this.isOffender()
                  ? { offender: person }
                  : { witness: person }),
                model: this.model(),
              },
            )
            .afterClosed()
            .pipe(map(() => person)),
        ),
      )
      .subscribe(person => {
        this.reload$.next({
          type: 'call',
          ...(this.isOffender()
            ? { offenderId: person.id }
            : { witnessId: person.id }),
        });
      });
  }

  private listenToReloadWitness() {
    this.reloadWitness$
      .pipe(takeUntil(this.destroy$))
      .pipe(
        filter(() => this.employeeService.hasPermissionTo('MANAGE_WITNESS')),
      )
      .pipe(switchMap(() => this.witnessService.loadForCase(this.model().id)))
      .subscribe(list => {
        this.model().id ? this.witness.set(list) : this.witness.set([]);
      });
  }

  private listenToAddWitness() {
    this.addWitness$
      .pipe(
        filter(() => this.employeeService.hasPermissionTo('MANAGE_WITNESS')),
      )
      .pipe(
        exhaustMap(() =>
          this.witnessService
            .openCreateDialog(this.model().id, this.witness())
            .afterClosed(),
        ),
      )
      .subscribe(() => {
        this.reloadWitness$.next();
      });
  }

  canManageWitness() {
    const hasPermission =
      this.employeeService.hasPermissionTo('MANAGE_WITNESS');
    const isDisciplinaryCommittee =
      !!this.employeeService.isDisciplinaryCommittee();
    const isInMyInbox = this.model().inMyInbox();

    return hasPermission && (isDisciplinaryCommittee || isInMyInbox);
  }

  isMe(person: Witness | Offender) {
    return person instanceof Witness
      ? this.employeeService.getEmployee()?.id === person?.witnessInfo?.id
      : this.employeeService.getEmployee()?.id === person?.offenderInfo?.id;
  }
}
