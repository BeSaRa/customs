import { EmployeeService } from '@services/employee.service';
import {
  Component,
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
import { Violation } from '@models/violation';
import { Investigation } from '@models/investigation';
import { OffenderViolationsPopupComponent } from '@standalone/popups/offender-violations-popup/offender-violations-popup.component';
import { SituationSearchComponent } from '@modules/electronic-services/components/situation-search/situation-search.component';
import { OffenderTypes } from '@enums/offender-types';
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
  @Input()
  violations!: Violation[];
  caseId = input('');
  @Input()
  investigationModel?: Investigation;
  @Input()
  readonly = false;
  @Input()
  canDelete = true;
  hasValidInvestigationSubject = input(false);
  add$: Subject<void> = new Subject<void>();
  @Output()
  offenders = new EventEmitter<Offender[]>();
  @Output()
  linkOffenderWithViolation = new EventEmitter<void>();
  @Output()
  askForSaveModel = new EventEmitter<void>();
  @Output()
  askForViolationListReload = new EventEmitter<void>();
  @Output()
  focusInvalidTab = new EventEmitter<boolean>();
  data = new Subject<Offender[]>();
  dataSource = new AppTableDataSource(this.data);
  reload$: Subject<void> = new Subject<void>();
  edit$ = new Subject<Offender>();
  delete$ = new Subject<Offender>();
  situationSearch$ = new Subject<{ offender: Offender; isCompany: boolean }>();
  displayedColumns = [
    'offenderName',
    'qid',
    'departmentCompany',
    'jobTitle',
    'actions',
  ];
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
    this.reload$.next();
  }

  private listenToAdd() {
    this.add$
      .pipe(
        exhaustMap(() => {
          if (this.hasValidInvestigationSubject())
            return this.dialog
              .open(OffenderCriteriaPopupComponent, {
                data: {
                  caseId: this.caseId,
                  violations: this.violations,
                  offenders: this.dataSource.data,
                  askForSaveModel: this.askForSaveModel,
                  askForViolationListReload: this.askForViolationListReload,
                },
              })
              .afterClosed();
          else {
            this.focusInvalidTab.emit(true);
            return of(null);
          }
        }),
        filter(result => !!result),
      )
      .subscribe(() => {
        this.reload$.next();
        this.linkOffenderWithViolation.emit();
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
                this.data.next(pagination.rs);
                return pagination;
              }),
            )
            .pipe(ignoreErrors()),
        ),
      )
      .subscribe(pagination => this.offenders.next(pagination.rs || []));
  }

  getOffenderType(type: number) {
    return this.offenderTypesMap[type].getNames();
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
        this.reload$.next();
        this.linkOffenderWithViolation.emit();
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
                caseId: this.investigationModel?.id,
                violations: this.violations,
                readonly: this.readonly,
              },
            })
            .afterClosed(),
        ),
      )
      .subscribe(() => this.linkOffenderWithViolation.emit());
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

  resetDataList() {
    this.data.next([]);
    this.offenders.emit([]);
  }

  isClearingAgent(element: Offender) {
    return element.type === OffenderTypes.ClEARING_AGENT;
  }
}
