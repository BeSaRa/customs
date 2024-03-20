import {
  Component,
  computed,
  effect,
  inject,
  input,
  OnInit,
  signal,
} from '@angular/core';
import { Offender } from '@models/offender';
import { Investigation } from '@models/investigation';
import { LangService } from '@services/lang.service';
import { MatTooltip } from '@angular/material/tooltip';
import { CallRequest } from '@models/call-request';
import { Subject } from 'rxjs';
import { filter, switchMap, takeUntil } from 'rxjs/operators';
import { SummonType } from '@enums/summon-type';
import { ignoreErrors } from '@utils/utils';
import { OnDestroyMixin } from '@mixins/on-destroy-mixin';
import { CallRequestService } from '@services/call-request.service';
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
import { DatePipe } from '@angular/common';
import { ConfigService } from '@services/config.service';
import { IconButtonComponent } from '@standalone/components/icon-button/icon-button.component';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { LookupService } from '@services/lookup.service';
import { CallRequestStatus } from '@enums/call-request-status';
import { Lookup } from '@models/lookup';
import { AdminResult } from '@models/admin-result';
import { ToastService } from '@services/toast.service';
import { Witness } from '@models/witness';

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
  edit$ = new Subject<CallRequest>();
  view$ = new Subject<CallRequest>();
  service = inject(CallRequestService);
  selectedChange = effect(() => {
    if (this.selected() === this.person()) {
      this.reload$.next();
    }
  });
  config = inject(ConfigService);
  displayedColumns = [
    'call_request_date',
    'call_request_creator',
    'status',
    'actions',
  ];
  lookupService = inject(LookupService);
  toast = inject(ToastService);
  statuses = signal(
    this.lookupService.lookups.obligationToAttendStatus.filter(
      item =>
        ![
          CallRequestStatus.APOLOGY,
          // CallRequestStatus.UNDER_PROCEDURE,
        ].includes(item.lookupKey),
    ),
  );

  reloadInput = input.required<
    Subject<{
      type: 'call' | 'investigation';
      offenderId?: number;
      witnessId?: number;
    }>
  >();

  ngOnInit(): void {
    this.listenToReload();
    this.listenToView();
    this.listenToEdit();
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

  private listenToEdit() {
    this.edit$
      .pipe(takeUntil(this.destroy$))
      .pipe(
        switchMap(callRequest => {
          return callRequest
            .openEdit({
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

  private listenToReloadInput() {
    this.reloadInput() &&
      this.reloadInput()
        .pipe(takeUntil(this.destroy$))
        .pipe(
          filter(
            value =>
              value.type === 'call' && value.offenderId === this.person().id,
          ),
        )
        .subscribe(() => this.reload$.next());
  }
}
