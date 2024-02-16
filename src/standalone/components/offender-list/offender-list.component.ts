import { EmployeeService } from '@services/employee.service';
import {
  Component,
  computed,
  EventEmitter,
  inject,
  Input,
  input,
  OnInit,
  Output,
} from '@angular/core';

import { IconButtonComponent } from '@standalone/components/icon-button/icon-button.component';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { LangService } from '@services/lang.service';
import {
  exhaustMap,
  filter,
  map,
  of,
  Subject,
  switchMap,
  takeUntil,
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
import { Investigation } from '@models/investigation';
import { OffenderViolationsPopupComponent } from '@standalone/popups/offender-violations-popup/offender-violations-popup.component';
import { SituationSearchComponent } from '@modules/electronic-services/components/situation-search/situation-search.component';
import { OffenderTypes } from '@enums/offender-types';
import { ignoreErrors } from '@utils/utils';
import { ReportType } from '@app-types/validation-return-type';
import { ClearingAgent } from '@models/clearing-agent';

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
  model = input.required<Investigation>();
  caseId = computed(() => this.model().id);
  @Input()
  readonly = false;
  @Input()
  canModifyOffenders = true;
  hasValidInvestigationSubject = input(false);
  add$: Subject<void> = new Subject<void>();
  @Output()
  offenderAdded: EventEmitter<Offender> = new EventEmitter<Offender>();
  @Output()
  offenderDeleted: EventEmitter<Offender> = new EventEmitter<Offender>();
  @Output()
  updateModel = new EventEmitter<void>();
  reportType = input(`None` as ReportType);
  @Output()
  askForSaveModel = new EventEmitter<void>();
  @Output()
  askForViolationListReload = new EventEmitter<void>();
  @Output()
  focusInvalidTab = new EventEmitter<boolean>();
  @Output()
  askToReloadPenalties = new EventEmitter<void>();
  data = new Subject<Offender[]>();
  dataSource = new AppTableDataSource(this.data);
  reload$: Subject<void> = new Subject<void>();
  edit$ = new Subject<Offender>();
  delete$ = new Subject<Offender>();
  situationSearch$ = new Subject<{ offender: Offender; isCompany: boolean }>();
  displayedColumns = ['offenderName', 'qid', 'departmentCompany', 'actions'];
  offenderViolation$: Subject<Offender> = new Subject<Offender>();
  offenderTypes = OffenderTypes;
  offenderTypesMap: Record<number, Lookup> =
    this.lookupService.lookups.offenderType.reduce(
      (acc, item) => ({
        ...acc,
        [item.lookupKey]: item,
      }),
      {},
    );

  ngOnInit(): void {
    this.listenToAdd();
    this.listenToReload();
    this.listenToDelete();
    this.listenToOffenderViolation();
    this.listenToSituationSearch();
  }

  private listenToAdd() {
    this.add$
      .pipe(
        exhaustMap(() => {
          if (this.hasValidInvestigationSubject()) {
            return this.dialog
              .open(OffenderCriteriaPopupComponent, {
                data: {
                  model: this.model,
                  askForSaveModel: this.askForSaveModel,
                  askForViolationListReload: this.askForViolationListReload,
                  reportType: this.reportType,
                  offenderAdded: this.offenderAdded,
                  linkOffenderWithViolation: this.updateModel,
                },
              })
              .afterClosed();
          } else {
            this.focusInvalidTab.emit(true);
            return of(null);
          }
        }),
      )
      .subscribe(() => {
        this.updateModel.emit();
        this.askToReloadPenalties.emit();
      });
  }

  private listenToReload() {
    this.reload$
      .pipe(takeUntil(this.destroy$))
      .pipe(filter(() => !!this.caseId()))
      .pipe(
        switchMap(() =>
          this.offenderService
            .load(undefined, { caseId: this.caseId() })
            .pipe(
              map(pagination => {
                this.model().offenderInfo = [...pagination.rs];
                return pagination;
              }),
            )
            .pipe(ignoreErrors()),
        ),
      )
      .subscribe(pagination => {
        this.model().offenderInfo = [...pagination.rs];
      });
  }

  private listenToDelete() {
    this.delete$
      .pipe(
        switchMap(model =>
          this.dialog
            .confirm(
              this.lang.map.msg_delete_x_confirm.change({
                x: model.getNames(),
              }),
            )
            .afterClosed()
            .pipe(map(userClick => ({ userClick, model }))),
        ),
      )
      .pipe(filter(({ userClick }) => userClick === UserClick.YES))
      .pipe(switchMap(({ model }) => model.delete().pipe(map(() => model))))
      .subscribe(model => {
        this.toast.success(
          this.lang.map.msg_delete_x_success.change({ x: model.getNames() }),
        );
        this.model().offenderInfo = [
          ...this.model().offenderInfo.filter(item => item.id !== model.id),
        ];
        this.model().offenderViolationInfo = [
          ...this.model().offenderViolationInfo.filter(
            item => item.offenderId !== model.id,
          ),
        ];
        this.offenderDeleted.emit(model);
        this.updateModel.emit();
        this.askToReloadPenalties.emit();
      });
  }

  private listenToOffenderViolation() {
    this.offenderViolation$
      .pipe(
        switchMap((offender: Offender) =>
          this.dialog
            .open(OffenderViolationsPopupComponent, {
              data: {
                offender: offender,
                model: this.model,
                readonly: this.readonly,
              },
            })
            .afterClosed(),
        ),
      )
      .subscribe(() => {
        this.updateModel.emit();
        this.askToReloadPenalties.emit();
      });
  }

  listenToSituationSearch() {
    this.situationSearch$
      .pipe(
        switchMap((data: { offender: Offender; isCompany: boolean }) => {
          let id;
          if (data.isCompany) {
            id = (data.offender.offenderInfo as unknown as ClearingAgent)
              .agencyId;
          } else {
            if (data.offender.type === OffenderTypes.BROKER) {
              id = (data.offender.offenderInfo as unknown as ClearingAgent)
                .agentId;
            } else if (data.offender.type === OffenderTypes.EMPLOYEE) {
              id = data.offender.offenderInfo?.id;
            }
          }
          return this.dialog
            .open(SituationSearchComponent, {
              data: {
                id,
                type: data.offender.type,
                isCompany: data.isCompany,
              },
            })
            .afterClosed();
        }),
      )
      .subscribe();
  }

  resetDataList() {
    this.data.next([]);
  }

  assertType(item: Offender): Offender {
    return new Offender().clone<Offender>(item);
  }
}
