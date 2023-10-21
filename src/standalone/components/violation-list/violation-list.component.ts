import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LangService } from '@services/lang.service';
import { IconButtonComponent } from '@standalone/components/icon-button/icon-button.component';
import { exhaustMap, filter, map, Subject, switchMap, takeUntil } from 'rxjs';
import { OnDestroyMixin } from '@mixins/on-destroy-mixin';
import { InvestigationService } from '@services/investigation.service';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { AppTableDataSource } from '@models/app-table-data-source';
import { ViolationService } from '@services/violation.service';
import { Violation } from '@models/violation';
import { Config } from '@constants/config';
import { ignoreErrors } from '@utils/utils';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DialogService } from '@services/dialog.service';
import { UserClick } from '@enums/user-click';
import { ToastService } from '@services/toast.service';
import { ViolationTypeService } from '@services/violation-type.service';
import { ViolationClassificationService } from '@services/violation-classification.service';

@Component({
  selector: 'app-violation-list',
  standalone: true,
  imports: [CommonModule, IconButtonComponent, MatTableModule, MatSortModule, MatTooltipModule],
  templateUrl: './violation-list.component.html',
  styleUrls: ['./violation-list.component.scss'],
})
export class ViolationListComponent extends OnDestroyMixin(class {}) implements OnInit {
  dialog = inject(DialogService);
  toast = inject(ToastService);
  lang = inject(LangService);
  violationTypeService = inject(ViolationTypeService);
  violationClassificationService = inject(ViolationClassificationService);
  @Input()
  caseId!: string;
  @Input()
  title: string = this.lang.map.violations;
  add$: Subject<void> = new Subject<void>();
  service = inject(InvestigationService);
  data = new Subject<Violation[]>();
  dataSource = new AppTableDataSource(this.data);
  displayedColumns = ['violationType', 'description', 'actions'];
  reload$: Subject<void> = new Subject<void>();
  edit$ = new Subject<Violation>();
  delete$ = new Subject<Violation>();
  violationService = inject(ViolationService);
  protected readonly Config = Config;

  @Output()
  violations = new EventEmitter<Violation[]>();

  ngOnInit(): void {
    this.listenToAdd();
    this.listenToReload();
    this.listenToEdit();
    this.listenToDelete();
    this.reload$.next();
  }

  private listenToAdd() {
    this.add$
      .pipe(takeUntil(this.destroy$))
      .pipe(switchMap(() => this.service.openAddViolation(this.caseId).afterClosed()))
      .subscribe(() => this.reload$.next());
  }

  private listenToReload() {
    this.reload$
      .pipe(takeUntil(this.destroy$))
      .pipe(filter(() => !!this.caseId))
      .pipe(
        switchMap(() =>
          this.violationService
            .load(undefined, { caseId: this.caseId })
            .pipe(
              map(pagination => {
                this.data.next(pagination.rs);
                return pagination;
              })
            )
            .pipe(ignoreErrors())
        )
      )
      .subscribe(pagination => this.violations.next(pagination.rs || []));
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
              }))
            )
            .pipe(ignoreErrors())
        )
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
              })
            )
            .pipe(ignoreErrors())
        )
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
            .afterClosed()
        )
      )
      .subscribe(() => this.reload$.next());
  }

  private listenToDelete() {
    this.delete$
      .pipe(
        exhaustMap(model =>
          this.dialog
            .confirm(this.lang.map.msg_delete_x_confirm.change({ x: model.description }))
            .afterClosed()
            .pipe(
              map(userClick => ({
                model,
                userClick,
              }))
            )
        )
      )
      .pipe(filter(({ userClick }) => userClick === UserClick.YES))
      .pipe(exhaustMap(({ model }) => model.delete().pipe(map(() => model))))
      .subscribe(model => {
        this.toast.success(this.lang.map.msg_delete_x_success.change({ x: model.description }));
        this.reload$.next();
      });
  }
}
