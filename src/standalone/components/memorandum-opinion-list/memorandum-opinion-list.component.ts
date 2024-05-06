import { Component, EventEmitter, inject, input, OnInit } from '@angular/core';
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
import { Subject } from 'rxjs';
import { LangService } from '@services/lang.service';
import { IconButtonComponent } from '@standalone/components/icon-button/icon-button.component';
import { MatTooltip } from '@angular/material/tooltip';
import { OnDestroyMixin } from '@mixins/on-destroy-mixin';
import { switchMap, takeUntil } from 'rxjs/operators';
import { InvestigationService } from '@services/investigation.service';
import { Memorandum } from '@models/memorandum';
import { DatePipe } from '@angular/common';
import { ConfigService } from '@services/config.service';
import { ignoreErrors } from '@utils/utils';
import { ToastService } from '@services/toast.service';
import { EmployeeService } from '@services/employee.service';

@Component({
  selector: 'app-memorandum-opinion-list',
  standalone: true,
  imports: [
    MatTable,
    IconButtonComponent,
    MatColumnDef,
    MatHeaderCell,
    MatCellDef,
    MatCell,
    MatHeaderCellDef,
    MatHeaderRow,
    MatRow,
    MatNoDataRow,
    MatHeaderRowDef,
    MatRowDef,
    MatTooltip,
    DatePipe,
  ],
  templateUrl: './memorandum-opinion-list.component.html',
  styleUrl: './memorandum-opinion-list.component.scss',
})
export class MemorandumOpinionListComponent
  extends OnDestroyMixin(class {})
  implements OnInit
{
  lang = inject(LangService);
  investigationService = inject(InvestigationService);
  employeeService = inject(EmployeeService);
  config = inject(ConfigService);
  model = input.required<Investigation>();
  updateModel = input.required<EventEmitter<void>>();
  models: unknown[] = [];
  displayedColumns: string[] = [
    'investigator',
    'referralNumber',
    'referralDate',
    'memoDate',
    'viewMemo',
  ];
  add$ = new Subject<void>();
  reload$ = new Subject<void>();
  view$: Subject<Memorandum> = new Subject();
  approve$: Subject<Memorandum> = new Subject();
  edit$: Subject<Memorandum> = new Subject();
  private toast = inject(ToastService);

  assertType(item: unknown): Memorandum {
    return item as Memorandum;
  }

  ngOnInit(): void {
    this.listenToAdd();
    this.listenToReload();
    this.listenToView();
    this.listenToApprove();
    this.listenToEdit();
    this.reload$.next();
  }

  private listenToAdd() {
    this.add$
      .pipe(
        switchMap(() =>
          this.investigationService
            .openCreateMemorandumDialog(this.model(), this.updateModel)
            .afterClosed(),
        ),
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.reload$.next();
      });
  }

  private listenToReload() {
    this.reload$
      .pipe(takeUntil(this.destroy$))
      .pipe(
        switchMap(() =>
          this.investigationService.loadMemorandums(this.model().id),
        ),
      )
      .subscribe(models => {
        this.models = models;
      });
  }

  private listenToView() {
    this.view$
      .pipe(takeUntil(this.destroy$))
      .pipe(
        switchMap(model =>
          this.investigationService
            .viewAttachment(model.id, '')
            .pipe(ignoreErrors()),
        ),
      )
      .subscribe();
  }

  private listenToApprove() {
    this.approve$
      .pipe(takeUntil(this.destroy$))
      .pipe(
        switchMap(model =>
          this.investigationService
            .approveMemorandum(model.id)
            .pipe(ignoreErrors()),
        ),
      )
      .subscribe(() => {
        this.toast.success(this.lang.map.memorandum_approved_successfully);
        this.reload$.next();
      });
  }

  private listenToEdit() {
    this.edit$
      .pipe(takeUntil(this.destroy$))
      .pipe(
        switchMap(model => {
          return this.investigationService
            .openEditMemorandumDialog(model, this.model(), this.updateModel)
            .afterClosed();
        }),
      )
      .subscribe(() => {
        this.reload$.next();
      });
  }

  canManageMemoOpinion() {
    return (
      this.model().inMyInbox() &&
      this.employeeService.hasPermissionTo('ADD_MEMO_OPINION')
    );
  }
}
