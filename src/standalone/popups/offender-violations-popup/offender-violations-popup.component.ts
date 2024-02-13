import { LangService } from '@services/lang.service';
import {
  Component,
  computed,
  inject,
  InputSignal,
  OnInit,
  signal,
} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { ButtonComponent } from '@standalone/components/button/button.component';
import { IconButtonComponent } from '@standalone/components/icon-button/icon-button.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import {
  BehaviorSubject,
  combineLatest,
  exhaustMap,
  filter,
  map,
  of,
  Subject,
  switchMap,
  takeUntil,
  tap,
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
import { MawaredEmployee } from '@models/mawared-employee';
import { ClearingAgent } from '@models/clearing-agent';
import { Investigation } from '@models/investigation';
import { ProofTypes } from '@enums/proof-types';
import { MatSort } from '@angular/material/sort';

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
    MatSort,
  ],
  templateUrl: './offender-violations-popup.component.html',
  styleUrls: ['./offender-violations-popup.component.scss'],
})
export class OffenderViolationsPopupComponent
  extends OnDestroyMixin(class {})
  implements OnInit
{
  lang = inject(LangService);
  data = inject<{
    offender: Offender;
    model: InputSignal<Investigation>;
    readonly: boolean;
  }>(MAT_DIALOG_DATA);
  offenderViolationService = inject(OffenderViolationService);
  dialog = inject(DialogService);
  toast = inject(ToastService);
  model = this.data.model;
  offender = this.data.offender;

  offenderTypes = OffenderTypes;

  offenderViolations = signal(this.getOffenderViolations());

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

  violations = computed(() => {
    const violationsIds = this.offenderViolations().map(i => i.violationId);
    return this.model().violationInfo.filter(item => {
      return (
        !violationsIds.includes(item.id) &&
        this.offender.type === item.offenderTypeInfo.lookupKey
      );
    });
  });

  control = new FormControl<number[]>([], [CustomValidators.required]);
  readonly = this.data.readonly;

  getOffenderViolations(): OffenderViolation[] {
    return this.model().offenderViolationInfo.filter(item => {
      return item.offenderId === this.offender.id;
    });
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
      .pipe(filter(() => !!this.model().id && !!this.offender.id))
      .pipe(
        switchMap(() =>
          this.offenderViolationService
            .load(undefined, {
              caseId: this.model().id,
            })
            .pipe(ignoreErrors()),
        ),
      )
      .subscribe(pagination => {
        this.model().offenderViolationInfo = [...pagination.rs];
        this.offenderViolations.set(this.getOffenderViolations());
      });
  }

  private listenToAdd() {
    this.addViolation$
      .pipe(takeUntil(this.destroy$))
      .pipe(
        switchMap(() => {
          return combineLatest(
            (this.control?.value || []).map((violationId: number) => {
              // TODO : call save from Model it self(OffenderViolation) but we have a backend issue related to this call
              return this.offenderViolationService
                .validateLinkOffenderWithViolation(
                  this.offender.id,
                  violationId,
                )
                .pipe(
                  tap((res: OffenderViolation[]) => {
                    if (res.length) {
                      res.forEach(offenderViolation => {
                        this.dialog.error(
                          this.lang.map
                            .msg_there_is_already_a_violation_with_same_type_and_date_exist +
                            ' ' +
                            this.lang.map.on_investigation_has_status_x.change({
                              x: offenderViolation.statusInfo.getNames(),
                            }),
                          this.lang.map.can_not_link_violation_x.change({
                            x: this.violations()
                              .find(v => v.id === violationId)
                              ?.violationTypeInfo?.getNames(),
                          }),
                        );
                      });
                    }
                  }),
                )
                .pipe(
                  switchMap(res => {
                    if (res.length) {
                      return of(false);
                    }
                    return new OffenderViolation()
                      .clone<OffenderViolation>({
                        caseId: this.model().id,
                        offenderId: this.offender.id,
                        violationId: violationId,
                        status: 1,
                        proofStatus: ProofTypes.UNDEFINED,
                      })
                      .save();
                  }),
                );
            }),
          );
        }),
      )
      .subscribe(() => {
        this.reload$.next(null);
        this.control.reset();
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

  isEmployee(model: MawaredEmployee | ClearingAgent): model is MawaredEmployee {
    return model.isEmployee();
  }

  isAgent(model: MawaredEmployee | ClearingAgent): model is ClearingAgent {
    return model.isAgent();
  }
}
