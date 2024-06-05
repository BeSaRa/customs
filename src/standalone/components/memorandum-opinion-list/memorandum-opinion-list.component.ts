import {
  Component,
  computed,
  effect,
  EventEmitter,
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
import { ReplaySubject, Subject, tap } from 'rxjs';
import { LangService } from '@services/lang.service';
import { IconButtonComponent } from '@standalone/components/icon-button/icon-button.component';
import { MatTooltip } from '@angular/material/tooltip';
import { OnDestroyMixin } from '@mixins/on-destroy-mixin';
import { filter, switchMap, takeUntil } from 'rxjs/operators';
import { InvestigationService } from '@services/investigation.service';
import { Memorandum } from '@models/memorandum';
import { DatePipe } from '@angular/common';
import { ConfigService } from '@services/config.service';
import { ignoreErrors } from '@utils/utils';
import { ToastService } from '@services/toast.service';
import { EmployeeService } from '@services/employee.service';
import { MemorandumCategories } from '@enums/memorandum-categories';
import { ProofTypes } from '@enums/proof-types';
import { MatCheckbox } from '@angular/material/checkbox';

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
    MatCheckbox,
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
  private toast = inject(ToastService);
  model = input.required<Investigation>();
  offendersIds = computed(() =>
    this.model()
      .getConcernedOffenders()
      .map(i => i.id),
  );
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
  changeIsExportableStatus$: Subject<Memorandum> = new Subject<Memorandum>();
  isManager = input.required<boolean>();
  masterComponent = input<MemorandumOpinionListComponent>();
  models$ = new ReplaySubject<Memorandum[]>(1);
  masterComponentEffect = effect(() => {
    if (this.masterComponent()) {
      this.listenToModelsChangeFromMaster();
    }
  });

  assertType(item: unknown): Memorandum {
    return item as Memorandum;
  }

  ngOnInit(): void {
    !this.isManager() && this.listenToAdd();
    this.listenToReload();
    this.listenToView();
    !this.isManager() && this.listenToApprove();
    this.listenToEdit();
    !this.isManager() && this.reload$.next();

    !this.isManager() && this.listenToModelsChange();
    !this.isManager() && this.listenToChangeIsExportableStatus();
  }

  listenToChangeIsExportableStatus() {
    this.changeIsExportableStatus$
      .pipe(filter(element => !!element.vsId))
      .pipe(
        switchMap(element => {
          return this.investigationService.updateIsExportable(
            element.vsId,
            !element.isExportable,
          );
        }),
      )
      .subscribe(() => this.reload$.next());
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
        tap(() => this.isManager() && this.masterComponent()?.reload$.next()),
      )
      .pipe(filter(() => !this.isManager()))
      .pipe(
        switchMap(() =>
          this.investigationService.loadMemorandums(
            this.model().id,
            this.isManager()
              ? MemorandumCategories.LEGAL_RESULT
              : MemorandumCategories.LEGAL_MEMORANDUM,
          ),
        ),
      )
      .subscribe(models => {
        this.models$.next(models);
      });
  }

  private listenToView() {
    this.view$
      .pipe(takeUntil(this.destroy$))
      .pipe(
        switchMap(model =>
          this.investigationService
            .viewAttachment(model.id, this.lang.map.view_memo)
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

  hasUnDecidedProofStatusItem() {
    return !!this.model()
      .offenderViolationInfo.filter(offenderViolation =>
        this.offendersIds().includes(offenderViolation.offenderId),
      )
      .filter(ov => ov.proofStatus === ProofTypes.UNDEFINED).length;
  }
  canManageMemoOpinion() {
    return (
      !this.isManager() &&
      this.model().inMyInbox() &&
      this.employeeService.hasPermissionTo('ADD_MEMO_OPINION')
    );
  }

  private listenToModelsChange() {
    this.models$.pipe(takeUntil(this.destroy$)).subscribe(models => {
      this.models = models.filter(item => {
        return item.category === MemorandumCategories.LEGAL_MEMORANDUM;
      });
    });
  }

  private listenToModelsChangeFromMaster() {
    this.masterComponent()
      ?.models$.pipe(takeUntil(this.destroy$))
      .subscribe(models => {
        this.models = models.filter(
          item => item.category === MemorandumCategories.LEGAL_RESULT,
        );
      });
  }
}
