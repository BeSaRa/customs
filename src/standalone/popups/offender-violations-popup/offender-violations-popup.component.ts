import { LangService } from '@services/lang.service';
import {
  Component,
  OnInit,
  inject,
  computed,
  InputSignal,
  signal,
} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { ButtonComponent } from '@standalone/components/button/button.component';
import { IconButtonComponent } from '@standalone/components/icon-button/icon-button.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AppTableDataSource } from '@models/app-table-data-source';
import {
  Subject,
  filter,
  switchMap,
  takeUntil,
  BehaviorSubject,
  exhaustMap,
  map,
  combineLatest,
} from 'rxjs';
import { OffenderViolation } from '@models/offender-violation';
import { OffenderViolationService } from '@services/offender-violation.service';
import { ignoreErrors } from '@utils/utils';
import { OnDestroyMixin } from '@mixins/on-destroy-mixin';
import { MatTableModule } from '@angular/material/table';
import { UserClick } from '@enums/user-click';
import { DialogService } from '@services/dialog.service';
import { ToastService } from '@services/toast.service';
import { Violation } from '@models/violation';
import { SelectInputComponent } from '@standalone/components/select-input/select-input.component';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { CustomValidators } from '@validators/custom-validators';
import { CommonModule, DatePipe } from '@angular/common';
import { Offender } from '@models/offender';
import { OffenderTypes } from '@enums/offender-types';

@Component({
  selector: 'app-offender-violations-popup',
  standalone: true,
  imports: [
    CommonModule,
    ButtonComponent,
    MatTooltipModule,
    DatePipe,
    SelectInputComponent,
    ReactiveFormsModule,
    MatTableModule,
    IconButtonComponent,
    MatDialogModule,
  ],
  templateUrl: './offender-violations-popup.component.html',
  styleUrls: ['./offender-violations-popup.component.scss'],
})
export class OffenderViolationsPopupComponent
  extends OnDestroyMixin(class {})
  implements OnInit
{
  lang = inject(LangService);
  data = inject(MAT_DIALOG_DATA);
  offenderViolationService = inject(OffenderViolationService);
  dialog = inject(DialogService);
  toast = inject(ToastService);

  offenderTypes = OffenderTypes;
  offenderViolations = signal([] as OffenderViolation[]);
  dataSource = computed(
    () => new AppTableDataSource(this.offenderViolations()),
  );
  reload$: BehaviorSubject<null> = new BehaviorSubject<null>(null);
  delete$ = new Subject<OffenderViolation>();
  addViolation$: Subject<void> = new Subject<void>();
  displayedColumns = [
    'violationClassification',
    'violationType',
    'violationData',
    'description',
    'repeat',
    'actions',
  ];
  control = new FormControl<number[]>([], [CustomValidators.required]);

  violations = computed(() => {
    return (this.data as { violations: InputSignal<Violation[]> })
      .violations()
      .filter(
        (v: Violation | OffenderViolation) =>
          this.data.offender &&
          ((v as Violation).offenderTypeInfo
            ? !this.offenderViolations().find(
                ov => ov.violationId === (v as Violation).id,
              ) &&
              ((v as Violation).offenderTypeInfo.lookupKey ===
                this.data.offender.type ||
                (v as Violation).offenderTypeInfo.lookupKey ===
                  OffenderTypes.BOTH)
            : !this.offenderViolations().find(
                ov => ov.violationId === (v as OffenderViolation).violationId,
              ) &&
              ((v as OffenderViolation).offenderInfo.typeInfo.lookupKey ===
                this.data.offender.type ||
                (v as OffenderViolation).offenderInfo.typeInfo.lookupKey ===
                  OffenderTypes.BOTH)),
      );
  });
  readonly = this.data && this.data.readonly;
  offender: Offender = this.data && (this.data.offender as Offender);

  constructor() {
    super();
  }
  ngOnInit() {
    this.listenToReload();
    this.listenToDelete();
    this.listenToAdd();
    if (this.readonly) this.displayedColumns.pop();
  }

  private listenToReload() {
    this.reload$
      .pipe(takeUntil(this.destroy$))
      .pipe(filter(() => !!this.data.caseId && !!this.data.offender.id))
      .pipe(
        switchMap(() =>
          this.offenderViolationService
            .load(undefined, {
              caseId: this.data.caseId,
              offenderId: this.data.offender.id,
            })
            .pipe(ignoreErrors()),
        ),
      )
      .subscribe(pagination => {
        this.offenderViolations.set(pagination.rs);
      });
  }
  private listenToAdd() {
    this.addViolation$
      .pipe(takeUntil(this.destroy$))
      .pipe(
        switchMap(() => {
          return combineLatest(
            (this.control?.value || []).map((violationId: number) => {
              return this.offenderViolationService.create(
                new OffenderViolation().clone<OffenderViolation>({
                  caseId: this.data.caseId,
                  offenderId: this.data.offender.id,
                  violationId: violationId,
                  status: 1,
                  isProved: true,
                }),
              );
            }),
          );
        }),
      )
      .subscribe(() => {
        this.control.reset();
        this.reload$.next(null);
      });
  }
  private listenToDelete() {
    this.delete$
      .pipe(
        exhaustMap(model => {
          const deletedViolation = new Violation().clone<Violation>({
            ...this.offenderViolations().find(
              v => v.violationId === model.violationId,
            )?.violationInfo,
          });
          return this.dialog
            .confirm(
              this.lang.map.msg_delete_link_with_x_confirm.change({
                x: deletedViolation.getOffenderViolationSelectNames(),
              }),
            )
            .afterClosed()
            .pipe(
              map(userClick => ({
                model,
                userClick,
              })),
            );
        }),
      )
      .pipe(filter(({ userClick }) => userClick === UserClick.YES))
      .pipe(exhaustMap(({ model }) => model.delete().pipe(map(() => model))))
      .subscribe(model => {
        const deletedViolation = new Violation().clone<Violation>({
          ...this.offenderViolations().find(
            v => v.violationId === model.violationId,
          )?.violationInfo,
        });
        this.toast.success(
          this.lang.map.msg_delete_x_success.change({
            x: deletedViolation.getOffenderViolationSelectNames(),
          }),
        );
        this.reload$.next(null);
      });
  }
}
