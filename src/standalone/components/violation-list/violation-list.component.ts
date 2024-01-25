import {
  Component,
  EventEmitter,
  inject,
  input,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { LangService } from '@services/lang.service';
import { IconButtonComponent } from '@standalone/components/icon-button/icon-button.component';
import {
  exhaustMap,
  filter,
  map,
  of,
  Subject,
  switchMap,
  takeUntil,
} from 'rxjs';
import { OnDestroyMixin } from '@mixins/on-destroy-mixin';
import { InvestigationService } from '@services/investigation.service';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { AppTableDataSource } from '@models/app-table-data-source';
import { ViolationService } from '@services/violation.service';
import { Violation } from '@models/violation';
import { ignoreErrors } from '@utils/utils';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DialogService } from '@services/dialog.service';
import { UserClick } from '@enums/user-click';
import { ToastService } from '@services/toast.service';
import { ViolationTypeService } from '@services/violation-type.service';
import { ViolationClassificationService } from '@services/violation-classification.service';
import { ButtonComponent } from '../button/button.component';
import { ReportType } from '@app-types/validation-return-type';

@Component({
  selector: 'app-violation-list',
  standalone: true,
  imports: [
    CommonModule,
    ButtonComponent,
    IconButtonComponent,
    MatTableModule,
    MatSortModule,
    MatTooltipModule,
  ],
  templateUrl: './violation-list.component.html',
  styleUrls: ['./violation-list.component.scss'],
})
export class ViolationListComponent
  extends OnDestroyMixin(class {})
  implements OnInit
{
  dialog = inject(DialogService);
  toast = inject(ToastService);
  lang = inject(LangService);
  violationTypeService = inject(ViolationTypeService);
  violationClassificationService = inject(ViolationClassificationService);
  service = inject(InvestigationService);
  violationService = inject(ViolationService);
  caseId = input('');
  add$: Subject<void> = new Subject<void>();
  data = new Subject<Violation[]>();
  dataSource = new AppTableDataSource(this.data);
  displayedColumns = [
    'violationType',
    'description',
    'violationData',
    'actions',
  ];
  reload$: Subject<void> = new Subject<void>();
  view$ = new Subject<Violation>();
  edit$ = new Subject<Violation>();
  delete$ = new Subject<Violation>();
  hasValidInvestigationSubject = input(false);
  @Output()
  selectViolation = new EventEmitter<Violation>();
  @Output()
  reloadOffenderViolationList = new EventEmitter<void>();
  @Output()
  askForSaveModel = new EventEmitter<void>();
  @Output()
  focusInvalidTab = new EventEmitter<boolean>();
  @Output()
  violations = new EventEmitter<Violation[]>();

  @Input()
  readonly = false;
  @Input()
  canModifyOffenders = true;
  reportType = input(`None` as ReportType);
  ngOnInit(): void {
    this.listenToAdd();
    this.listenToReload();
    this.listenToEdit();
    this.listenToView();
    this.listenToDelete();

    this.reload$.next();
  }
  private listenToAdd() {
    this.add$
      .pipe(takeUntil(this.destroy$))
      .pipe(
        switchMap(() => {
          if (this.hasValidInvestigationSubject()) {
            return this.service
              .openAddViolation(
                this.caseId,
                this.askForSaveModel,
                this.reportType,
              )
              .afterClosed();
          } else {
            this.focusInvalidTab.emit();
            return of(null);
          }
        }),
      )
      .subscribe(() => this.reload$.next());
  }

  private listenToReload() {
    this.reload$
      .pipe(takeUntil(this.destroy$))
      .pipe(filter(() => !!this.caseId()))
      .pipe(
        switchMap(() =>
          this.violationService
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
      .subscribe(pagination => this.violations.next(pagination.rs || []));
  }

  private listenToView() {
    this.view$
      .pipe(
        exhaustMap(model =>
          this.violationTypeService
            .loadById(model.violationTypeId)
            .pipe(
              map(type => ({
                type,
                model,
              })),
            )
            .pipe(ignoreErrors()),
        ),
      )
      .pipe(
        exhaustMap(({ type, model }) =>
          this.violationClassificationService
            .loadById(type.classificationId)
            .pipe(
              map(classification => {
                return {
                  classification,
                  model,
                  type,
                };
              }),
            )
            .pipe(ignoreErrors()),
        ),
      )
      .pipe(
        exhaustMap(({ model, type, classification }) =>
          model
            .openView({
              caseId: this.caseId,
              classificationId: type.classificationId,
              classifications: [classification],
              types: [type],
            })
            .afterClosed(),
        ),
      )
      .subscribe(() => this.reload$.next());
  }

  private listenToEdit() {
    this.edit$
      .pipe(
        exhaustMap(model =>
          this.violationTypeService
            .loadById(model.violationTypeId)
            .pipe(
              map(type => ({
                type,
                model,
              })),
            )
            .pipe(ignoreErrors()),
        ),
      )
      .pipe(
        exhaustMap(({ type, model }) =>
          this.violationClassificationService
            .loadById(type.classificationId)
            .pipe(
              map(classification => {
                return {
                  classification,
                  model,
                  type,
                };
              }),
            )
            .pipe(ignoreErrors()),
        ),
      )
      .pipe(
        exhaustMap(({ model, type, classification }) =>
          model
            .openEdit({
              caseId: this.caseId,
              classificationId: type.classificationId,
              classifications: [classification],
              types: [type],
            })
            .afterClosed(),
        ),
      )
      .subscribe(() => this.reload$.next());
  }

  private listenToDelete() {
    this.delete$
      .pipe(
        exhaustMap(model =>
          this.dialog
            .confirm(
              this.dataSource.data.length === 1
                ? this.lang.map.reset_violations_effects_msg
                : '',
              this.lang.map.msg_delete_x_confirm.change({
                x: model.description,
              }),
            )
            .afterClosed()
            .pipe(
              map(userClick => ({
                model,
                userClick,
              })),
            ),
        ),
      )
      .pipe(filter(({ userClick }) => userClick === UserClick.YES))
      .pipe(exhaustMap(({ model }) => model.delete().pipe(map(() => model))))
      .subscribe(model => {
        this.toast.success(
          this.lang.map.msg_delete_x_success.change({ x: model.description }),
        );
        this.reload$.next();
        this.reloadOffenderViolationList.emit();
      });
  }

  resetDataList() {
    this.data.next([]);
    this.violations.emit([]);
  }
}
