import { OffenderViolationService } from '@services/offender-violation.service';
import { EmployeeService } from '@services/employee.service';
import {
  Component,
  inject,
  Input,
  Output,
  OnInit,
  EventEmitter,
} from '@angular/core';

import { IconButtonComponent } from '@standalone/components/icon-button/icon-button.component';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { LangService } from '@services/lang.service';
import {
  exhaustMap,
  filter,
  map,
  Subject,
  switchMap,
  takeUntil,
  tap,
} from 'rxjs';
import { AppTableDataSource } from '@models/app-table-data-source';
import { OffenderService } from '@services/offender.service';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DialogService } from '@services/dialog.service';
import { OffenderCriteriaPopupComponent } from '@standalone/popups/offender-criteria-popup/offender-criteria-popup.component';
import { Offender } from '@models/offender';
import { OnDestroyMixin } from '@mixins/on-destroy-mixin';
import { LookupService } from '@services/lookup.service';
import { Lookup } from '@models/lookup';
import { UserClick } from '@enums/user-click';
import { ToastService } from '@services/toast.service';
import { Violation } from '@models/violation';
import { OffenderAttachmentPopupComponent } from '@standalone/popups/offender-attachment-popup/offender-attachment-popup.component';
import { Investigation } from '@models/investigation';
import { OffenderViolationsPopupComponent } from '@standalone/popups/offender-violations-popup/offender-violations-popup.component';
import { SituationSearchComponent } from '@modules/electronic-services/components/situation-search/situation-search.component';
import { OffenderTypes } from '@enums/offender-types';
import { TransformerAction } from '@contracts/transformer-action';
import { ignoreErrors } from '@utils/utils';

@Component({
  selector: 'app-offender-list',
  standalone: true,
  imports: [
    IconButtonComponent,
    MatSortModule,
    MatTableModule,
    MatTooltipModule,
  ],
  templateUrl: './offender-list.component.html',
  styleUrls: ['./offender-list.component.scss'],
})
export class OffenderListComponent
  extends OnDestroyMixin(class {})
  implements OnInit
{
  dialog = inject(DialogService);
  toast = inject(ToastService);
  lang = inject(LangService);
  lookupService = inject(LookupService);
  employeeService = inject(EmployeeService);
  offenderService = inject(OffenderService);
  offenderViolationService = inject(OffenderViolationService);
  @Input()
  violations!: Violation[];
  @Input()
  caseId?: string;
  @Input()
  investigationModel?: Investigation;
  @Input()
  readonly = false;
  add$: Subject<void> = new Subject<void>();
  attachments$: Subject<Offender> = new Subject<Offender>();
  transformer$ = new Subject<TransformerAction<Investigation>>();
  @Output() saveCase = new EventEmitter<
    Subject<TransformerAction<Investigation>>
  >();
  @Output()
  offenders = new EventEmitter<Offender[]>();
  data = new Subject<Offender[]>();
  dataSource = new AppTableDataSource(this.data);
  reload$: Subject<void> = new Subject<void>();
  edit$ = new Subject<Offender>();
  delete$ = new Subject<Offender>();
  situationSearch$ = new Subject<{ offender: Offender; isCompany: boolean }>();
  displayedColumns = ['offenderName', 'qid', 'jobTitle', 'actions'];
  offenderViolation$: Subject<Offender> = new Subject<Offender>();
  offenderTypes = OffenderTypes;
  offenderTypesMap: Record<number, Lookup> =
    this.lookupService.lookups.offenderType.reduce(
      (acc, item) => ({
        ...acc,
        [item.lookupKey]: item,
      }),
      {}
    );
  ngOnInit(): void {
    this.listenToAdd();
    this.listenToReload();
    this.listenToDelete();
    this.listenToAttachments();
    this.listenToOffenderViolation();
    this.listenToSituationSearch();
    this.listernToSaveCase();
    this.reload$.next();
  }

  listernToSaveCase() {
    this.transformer$
      .pipe(
        tap(
          (data: TransformerAction<Investigation>) =>
            data.action == 'done' && (this.caseId = data.model?.id || '')
        )
      )
      .pipe(
        filter(
          (data: TransformerAction<Investigation>) => data.action == 'save'
        )
      )
      .subscribe(() => {
        this.saveCase.emit(this.transformer$);
      });
  }
  private listenToAdd() {
    this.add$
      .pipe(
        exhaustMap(() =>
          this.dialog
            .open(OffenderCriteriaPopupComponent, {
              data: {
                caseId: this.caseId,
                violations: this.violations,
                offenders: this.dataSource.data,
                transformer$: this.transformer$,
              },
            })
            .afterClosed()
        )
      )
      .subscribe(() => this.reload$.next());
  }

  private listenToReload() {
    this.reload$
      .pipe(takeUntil(this.destroy$))
      .pipe(filter(() => !!this.caseId))
      .pipe(
        switchMap(() =>
          this.offenderService
            .load(undefined, { caseId: this.caseId })
            .pipe(
              map((pagination) => {
                this.data.next(pagination.rs);
                return pagination;
              })
            )
            .pipe(ignoreErrors())
        )
      )
      .subscribe((pagination) => this.offenders.next(pagination.rs || []));
  }
  getOffenderType(type: number) {
    return this.offenderTypesMap[type].getNames();
  }

  private listenToDelete() {
    this.delete$
      .pipe(
        switchMap((model) =>
          this.dialog
            .confirm(
              this.lang.map.msg_delete_x_confirm.change({ x: model.getNames() })
            )
            .afterClosed()
            .pipe(map((userClick) => ({ userClick, model })))
        )
      )
      .pipe(filter(({ userClick }) => userClick === UserClick.YES))
      .pipe(switchMap(({ model }) => model.delete().pipe(map(() => model))))
      .subscribe((model) => {
        this.toast.success(
          this.lang.map.msg_delete_x_success.change({ x: model.getNames() })
        );
        this.reload$.next();
      });
  }

  deleteAllOffender() {
    this.offenderService
      .deleteBulk(this.dataSource.data.map((offender: Offender) => offender.id))
      .subscribe(() => {
        this.reload$.next();
      });
  }
  private listenToAttachments() {
    this.attachments$
      .pipe(
        switchMap((model) =>
          this.dialog
            .open(OffenderAttachmentPopupComponent, {
              data: {
                model: this.investigationModel,
                offenderId: model.id,
                readonly: this.readonly,
              },
            })
            .afterClosed()
        )
      )
      .subscribe();
  }
  private listenToOffenderViolation() {
    this.offenderViolation$
      .pipe(
        switchMap((offender: Offender) =>
          this.dialog
            .open(OffenderViolationsPopupComponent, {
              data: {
                offender: offender,
                caseId: this.investigationModel?.id,
                violations: this.violations,
                readonly: this.readonly,
              },
            })
            .afterClosed()
        )
      )
      .subscribe();
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
  resetDataList() {
    this.data.next([]);
    this.offenders.emit([]);
  }
  isClearingAgent(element: Offender) {
    return element.type === OffenderTypes.ClEARING_AGENT;
  }
}
