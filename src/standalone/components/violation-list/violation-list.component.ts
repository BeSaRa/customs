import {
  Component,
  computed,
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
import { ViolationService } from '@services/violation.service';
import { Violation } from '@models/violation';
import { ignoreErrors } from '@utils/utils';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DialogService } from '@services/dialog.service';
import { UserClick } from '@enums/user-click';
import { ToastService } from '@services/toast.service';
import { ButtonComponent } from '../button/button.component';
import { ReportType } from '@app-types/validation-return-type';
import { Investigation } from '@models/investigation';

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
  service = inject(InvestigationService);
  violationService = inject(ViolationService);
  add$: Subject<void> = new Subject<void>();
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
  updateModel = new EventEmitter<void>();
  @Output()
  askForSaveModel = new EventEmitter<void>();
  @Output()
  focusInvalidTab = new EventEmitter<boolean>();

  @Input()
  readonly = false;
  @Input()
  canModifyOffenders = true;
  reportType = input(`None` as ReportType);

  model = input<Investigation>(new Investigation());

  caseId = computed(() => this.model()?.id);
  @Output()
  violationChanged = new EventEmitter<void>();

  ngOnInit(): void {
    this.listenToAdd();
    this.listenToReload();
    this.listenToEdit();
    this.listenToView();
    this.listenToDelete();
  }

  getViolations(): Violation[] {
    return this.model().violationInfo;
  }

  private listenToAdd() {
    this.add$
      .pipe(takeUntil(this.destroy$))
      .pipe(
        switchMap(() => {
          if (this.hasValidInvestigationSubject()) {
            return this.service
              .openAddViolation(
                this.model,
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
      .subscribe(() => {
        this.updateModel.emit();
        this.violationChanged.emit();
      });
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
                this.model().violationInfo = pagination.rs;
                return pagination;
              }),
            )
            .pipe(ignoreErrors()),
        ),
      )
      .subscribe();
  }

  private listenToView() {
    this.view$
      .pipe(
        exhaustMap(model => this.violationService.loadByIdComposite(model.id)),
      )
      .pipe(
        exhaustMap(model =>
          model
            .openView({
              model: this.model,
              caseId: this.caseId,
              reportType: this.reportType,
            })
            .afterClosed(),
        ),
      )
      .subscribe();
  }

  private listenToEdit() {
    this.edit$
      .pipe(
        exhaustMap(model => this.violationService.loadByIdComposite(model.id)),
      )
      .pipe(
        exhaustMap(model =>
          model
            .openEdit({
              model: this.model,
              caseId: this.caseId,
              reportType: this.reportType,
            })
            .afterClosed(),
        ),
      )
      .subscribe(() => this.violationChanged.emit());
  }

  private listenToDelete() {
    this.delete$
      .pipe(
        exhaustMap(model =>
          this.dialog
            .confirm(
              this.model().violationInfo.length === 1
                ? this.lang.map.reset_violations_effects_msg
                : '',
              this.lang.map.msg_delete_x_confirm.change({
                x: model.violationTypeInfo.getNames(),
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
        this.model().violationInfo = [
          ...this.model().violationInfo.filter(v => v.id !== model.id),
        ];
        this.model().offenderViolationInfo = [
          ...this.model().offenderViolationInfo.filter(ov => {
            return ov.violationId !== model.id;
          }),
        ];
        this.toast.success(
          this.lang.map.msg_delete_x_success.change({ x: model.description }),
        );
        this.reload$.next();
        this.updateModel.emit();
        // reload penalties
        this.violationChanged.emit();
      });
  }

  resetDataList() {}
}
