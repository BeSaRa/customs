import { DatePipe } from '@angular/common';
import {
  Component,
  computed,
  effect,
  inject,
  input,
  OnInit,
  signal,
} from '@angular/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
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
import { SummonType } from '@enums/summon-type';
import { OnDestroyMixin } from '@mixins/on-destroy-mixin';
import { AdminResult } from '@models/admin-result';
import { CallRequest } from '@models/call-request';
import { Investigation } from '@models/investigation';
import { Lookup } from '@models/lookup';
import { Offender } from '@models/offender';
import { Witness } from '@models/witness';
import { CallRequestService } from '@services/call-request.service';
import { ConfigService } from '@services/config.service';
import { EmployeeService } from '@services/employee.service';
import { InvestigationService } from '@services/investigation.service';
import { LangService } from '@services/lang.service';
import { LookupService } from '@services/lookup.service';
import { ToastService } from '@services/toast.service';
import { IconButtonComponent } from '@standalone/components/icon-button/icon-button.component';
import { ignoreErrors } from '@utils/utils';
import { Subject } from 'rxjs';
import { filter, switchMap, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-call-request-records-table',
  standalone: true,
  imports: [
    MatTooltip,
    MatTable,
    MatColumnDef,
    MatHeaderCell,
    MatHeaderCellDef,
    MatCellDef,
    MatCell,
    MatHeaderRow,
    MatRow,
    MatNoDataRow,
    MatRowDef,
    MatHeaderRowDef,
    DatePipe,
    IconButtonComponent,
    MatMenu,
    MatMenuItem,
    MatMenuTrigger,
    MatCheckboxModule,
  ],
  templateUrl: './call-request-records-table.component.html',
  styleUrl: './call-request-records-table.component.scss',
})
export class CallRequestRecordsTableComponent
  extends OnDestroyMixin(class {})
  implements OnInit
{
  person = input.required<Offender | Witness>();
  model = input.required<Investigation>();
  selected = input<Offender | Witness>();
  isOffender = computed(() => {
    return this.person() instanceof Offender;
  });
  isWitness = computed(() => {
    return this.person() instanceof Witness;
  });
  lang = inject(LangService);
  models: CallRequest[] = [];
  reload$ = new Subject<void>();
  view$ = new Subject<CallRequest>();
  service = inject(CallRequestService);
  investigationService = inject(InvestigationService);
  selectedChange = effect(() => {
    if (this.selected() === this.person()) {
      this.reload$.next();
    }
  });
  config = inject(ConfigService);
  displayedColumns = [
    'call_request_date',
    'call_request_time',
    'call_request_creator',
    'status',
    'actions',
  ];
  lookupService = inject(LookupService);
  toast = inject(ToastService);
  statuses = signal(this.lookupService.lookups.obligationToAttendStatus);

  reloadInput = input.required<
    Subject<{
      type: 'call' | 'investigation';
      offenderId?: number;
      witnessId?: number;
    }>
  >();

  employeeService = inject(EmployeeService);

  ngOnInit(): void {
    this.listenToReload();
    this.listenToView();
    this.listenToReloadInput();
  }

  assertType(item: unknown): CallRequest {
    return item as CallRequest;
  }

  private listenToReload() {
    this.reload$
      .pipe(takeUntil(this.destroy$))
      .pipe(
        switchMap(() => {
          return this.service
            .load(undefined, {
              caseId: this.model().id,
              summonedType: this.isOffender()
                ? SummonType.OFFENDER
                : SummonType.WITNESS,
              summonedId: this.person().id,
            })
            .pipe(ignoreErrors());
        }),
      )
      .subscribe(result => {
        this.models = result.rs;
      });
  }

  private listenToView() {
    this.view$
      .pipe(takeUntil(this.destroy$))
      .pipe(
        switchMap(callRequest => {
          return callRequest
            .openView({
              ...(this.isOffender()
                ? { offender: this.person() }
                : { witness: this.person() }),
              caseId: this.model().id,
            })
            .afterClosed();
        }),
      )
      .subscribe();
  }

  updateCallRequestStatus(callRequest: CallRequest, status: Lookup) {
    callRequest
      .clone<CallRequest>()
      .updateStatus(status.lookupKey)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.toast.success(
          this.lang.map.msg_status_x_changed_success.change({ x: '' }),
        );
        callRequest.status = status.lookupKey;
        callRequest.statusInfo = AdminResult.createInstance(status);
      });
  }

  changeIsExportableStatus(item: CallRequest) {
    this.investigationService
      .updateIsExportable(item.documentVsId, !item.isExportable, false, true)
      .subscribe(() => this.reload$.next());
  }

  private listenToReloadInput() {
    this.reloadInput() &&
      this.reloadInput()
        .pipe(takeUntil(this.destroy$))
        .pipe(
          filter(value =>
            value.type === 'call' && this.isOffender()
              ? value.offenderId === this.person().id
              : value.witnessId === this.person().id,
          ),
        )
        .subscribe(() => this.reload$.next());
  }
}
