import {
  Component,
  computed,
  effect,
  inject,
  input,
  OnInit,
} from '@angular/core';
import { Investigation } from '@models/investigation';
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
import { LangService } from '@services/lang.service';
import { Offender } from '@models/offender';
import { ButtonComponent } from '@standalone/components/button/button.component';
import { Subject } from 'rxjs';
import { OffenderTypes } from '@enums/offender-types';
import { IconButtonComponent } from '@standalone/components/icon-button/icon-button.component';
import { MatTooltip } from '@angular/material/tooltip';
import { Lookup } from '@models/lookup';
import { LookupService } from '@services/lookup.service';
import { MatIcon } from '@angular/material/icon';
import { AppIcons } from '@constants/app-icons';
import { OffenderViolation } from '@models/offender-violation';
import { OffenderViolationsComponent } from '@standalone/components/offender-violations/offender-violations.component';
import { InvestigationRecordsTableComponent } from '@standalone/components/investigation-records-table/investigation-records-table.component';
import { NgClass } from '@angular/common';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { OnDestroyMixin } from '@mixins/on-destroy-mixin';
import { switchMap, takeUntil } from 'rxjs/operators';
import { InvestigationReportService } from '@services/investigation-report.service';
import { InvestigationReport } from '@models/investigation-report';
import { EmployeeService } from '@services/employee.service';
import { AdminResult } from '@models/admin-result';
import { DialogService } from '@services/dialog.service';
import { CallRequestService } from '@services/call-request.service';
import { CallRequest } from '@models/call-request';
import { CallRequestRecordsTableComponent } from '@standalone/components/call-request-records-table/call-request-records-table.component';

@Component({
  selector: 'app-legal-affairs-offenders',
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
  templateUrl: './legal-affairs-offenders.component.html',
  styleUrl: './legal-affairs-offenders.component.scss',
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
export class LegalAffairsOffendersComponent
  extends OnDestroyMixin(class {})
  implements OnInit
{
  protected readonly offenderTypes = OffenderTypes;
  lang = inject(LangService);
  lookupService = inject(LookupService);
  investigationReportService = inject(InvestigationReportService);
  callRequestService = inject(CallRequestService);
  model = input.required<Investigation>();
  concernedOffenders = computed(() => {
    return (this.model() && this.model().getConcernedOffenders()) || [];
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

  effect = effect(() => {
    console.log(this.model());
    console.log(this.concernedOffenders());
    console.log(this.offenderViolationsMap());
  });
  displayedColumns = [
    'offenderName',
    'qid',
    'departmentCompany',
    'jobGrade',
    'call',
    'investigation',
    // 'hearingStatements',
  ];

  requestCall$ = new Subject<Offender>();
  requestInvestigation$ = new Subject<Offender>();
  requestHearing$ = new Subject<Offender>();

  offenderTypesMap: Record<number, Lookup> =
    this.lookupService.lookups.offenderType.reduce((acc, item) => {
      return {
        ...acc,
        [item.lookupKey]: item,
      };
    }, {});

  selectedOffender?: Offender;
  employeeService = inject(EmployeeService);

  ngOnInit(): void {
    this.listenToRequestCall();
    this.listenToRequestInvestigation();

    // this.requestInvestigation$.next(this.concernedOffenders()[0]);
    // this.requestCall$.next(this.concernedOffenders()[0]);
  }

  assertType(item: unknown): Offender {
    return item as Offender;
  }

  protected readonly AppIcons = AppIcons;

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
        switchMap(offender => {
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
                offender,
                caseId: this.model().id,
              },
            )
            .afterClosed();
        }),
      )
      .subscribe(() => {
        // this.dialog.info(this.lang.map.this_feature_is_being_worked_on);
      });
  }

  private listenToRequestInvestigation() {
    this.requestInvestigation$
      .pipe(takeUntil(this.destroy$))
      .pipe(
        switchMap(offender =>
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
              { offender, caseId: this.model().id },
            )
            .afterClosed(),
        ),
      )
      .subscribe(offender => {
        console.log(offender);
      });
  }
}
