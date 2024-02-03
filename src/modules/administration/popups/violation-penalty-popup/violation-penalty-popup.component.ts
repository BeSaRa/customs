import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CrudDialogDataContract } from '@contracts/crud-dialog-data-contract';
import { ViolationPenalty } from '@models/violation-penalty';
import { AdminDialogComponent } from '@abstracts/admin-dialog-component';
import { UntypedFormGroup } from '@angular/forms';
import {
  catchError,
  exhaustMap,
  filter,
  isObservable,
  Observable,
  of,
  Subject,
  switchMap,
  takeUntil,
  throwError,
} from 'rxjs';
import { OperationType } from '@enums/operation-type';
import { ViolationTypeService } from '@services/violation-type.service';
import { ViolationType } from '@models/violation-type';
import { Lookup } from '@models/lookup';
import { LookupService } from '@services/lookup.service';
import { PenaltyService } from '@services/penalty.service';
import { Penalty } from '@models/penalty';
import { PenaltySignerTypes } from '@enums/penalty-signer-types';
import { OffenderTypes } from '@enums/offender-types';
import { OffenderLevels } from '@enums/offender-levels';
import { CustomValidators } from '@validators/custom-validators';
import { ViolationPenaltyService } from '@services/violation-penalty.service';
import { ignoreErrors } from '@utils/utils';
import { PenaltyGuidances } from '@enums/penalty-guidances';

@Component({
  selector: 'app-violation-penalty-popup',
  templateUrl: './violation-penalty-popup.component.html',
  styleUrls: ['./violation-penalty-popup.component.scss'],
})
export class ViolationPenaltyPopupComponent extends AdminDialogComponent<ViolationPenalty> {
  form!: UntypedFormGroup;
  data: CrudDialogDataContract<ViolationPenalty> = inject(MAT_DIALOG_DATA);
  violationPenaltyService = inject(ViolationPenaltyService);

  violationTypeService = inject(ViolationTypeService);
  violationTypes!: ViolationType[];
  filteredViolationTypes!: ViolationType[];

  penaltyService = inject(PenaltyService);
  penalties: Penalty[] = [];
  filteredPenalties: Penalty[] = [];
  penaltyGuidance: Penalty[] = [];

  penaltySigners: Lookup[] = inject(LookupService).lookups.penaltySigner;
  filteredPenaltySigners: Lookup[] = this.penaltySigners;
  offenderLevels: Lookup[] = inject(LookupService).lookups.offenderLevel;
  filteredOffenderLevels: Lookup[] = this.offenderLevels;
  offenderTypes: Lookup[] = inject(LookupService).lookups.offenderType;
  saveBulk$: Subject<void> = new Subject<void>();

  protected override _initPopup(): void {
    super._initPopup();
    this.listenToSaveBulk();
    this.getViolationTypes();
    this.getPenalties();
  }

  protected getViolationTypes() {
    this.violationTypeService.loadAsLookups().subscribe(data => {
      this.violationTypes = data;
      this.filteredViolationTypes = data;
      this.setFilteredViolationType();
    });
  }

  protected getPenalties() {
    this.penaltyService.loadAsLookups().subscribe(data => {
      this.penalties = data;
      this.filteredPenalties = data;
      if (this.operation === OperationType.UPDATE) this.setFilteredPenalties();
    });
  }

  _buildForm(): void {
    this.form = this.fb.group(this.model.buildForm(true));
  }

  protected _beforeSave(): boolean | Observable<boolean> {
    this.form.markAllAsTouched();
    return this.form.valid;
  }

  protected _prepareModel(): ViolationPenalty | Observable<ViolationPenalty> {
    return new ViolationPenalty().clone<ViolationPenalty>({
      ...this.model,
      ...this.form.value,
    });
  }

  protected override _afterBuildForm(): void {
    super._afterBuildForm();
    this.onOffenderTypeChange();
    this.onPenaltySignerChange();
    this.onOffenderLevelChange();
    this.onPenaltiesChange();
    if (this.operation === OperationType.UPDATE) {
      this.setFilteredPenaltySigners();
      this.setFilteredViolationType();
      this.setOffenderLevelValidity();
    }
  }

  protected _afterSave(): void {
    this.operation = OperationType.UPDATE;
    this.toast.success(
      this.lang.map.msg_save_x_success.change({ x: this.model.getNames() }),
    );
    this.dialogRef.close(this.model);
  }

  onPenaltySignerChange() {
    this.penaltySignerCtrl?.valueChanges.subscribe(() => {
      this.offenderLevelCtrl?.setValue(null);
      this.penaltyArrayCtrl?.setValue([]);
      this.penaltyGuidanceCtrl?.setValue(null);
      this.form.updateValueAndValidity();
      this.setFilteredOffenderLevels();
      this.setFilteredPenalties();
    });
  }

  onOffenderLevelChange() {
    this.offenderLevelCtrl?.valueChanges.subscribe(() => {
      this.penaltyArrayCtrl?.setValue([]);
      this.penaltyGuidanceCtrl?.setValue(null);
      this.form.updateValueAndValidity();
      this.setFilteredPenalties();
    });
  }

  onOffenderTypeChange() {
    this.offenderTypeCtrl?.valueChanges.subscribe(() => {
      this.penaltySignerCtrl?.setValue(null);
      this.violationTypeCtrl?.setValue(null);
      this.form.updateValueAndValidity();
      this.setFilteredPenaltySigners();
      this.setOffenderLevelValidity();
      this.setFilteredViolationType();
    });
  }

  onPenaltiesChange() {
    this.penaltyArrayCtrl?.valueChanges.subscribe(() => {
      this.penaltyGuidanceCtrl?.setValue(null);
      this.penaltyGuidanceCtrl?.updateValueAndValidity();
      this.setFilteredPenaltyGuidance();
    });
  }

  setOffenderLevelValidity() {
    const offenderType: OffenderTypes = this.offenderTypeCtrl?.value;
    const offenderLevel = this.offenderLevelCtrl;
    offenderLevel?.clearValidators();
    if (offenderType === OffenderTypes.EMPLOYEE) {
      offenderLevel?.setValidators(CustomValidators.required);
    }
  }

  setFilteredPenaltyGuidance() {
    if (!this.penalties) return;
    this.penaltyGuidance = (this.penaltyArrayCtrl?.value as number[]).map(
      penaltyId => this.penalties.find(p => p.id === penaltyId)!,
    );
    if (this.model.penaltyGuidance === PenaltyGuidances.APPROPRIATE) {
      this.penaltyGuidanceCtrl?.setValue(this.model.penaltyArray[0]);
    }
  }

  needOffenderLevel(): boolean {
    const offenderTypeLookupKey = this.offenderTypes.find(
      offenderType => offenderType.lookupKey === this.offenderTypeCtrl?.value,
    )?.lookupKey;
    return (
      this.offenderTypeCtrl?.value &&
      offenderTypeLookupKey === OffenderTypes.EMPLOYEE &&
      this.penaltySignerCtrl?.value
    );
  }

  showPenalties() {
    return this.penaltySignerCtrl?.value && this.offenderLevelCtrl?.value;
  }

  showPenaltyGuidance() {
    return (this.penaltyArrayCtrl?.value as number[]).length > 0;
  }

  private setFilteredViolationType() {
    if (!this.offenderTypeCtrl?.value) return;
    this.filteredViolationTypes = this.violationTypes?.filter(
      violationType =>
        violationType.offenderType === this.offenderTypeCtrl?.value,
    );
  }

  setFilteredPenaltySigners() {
    const offenderTypeLookupKey = this.offenderTypes.find(
      offenderType => offenderType.lookupKey === this.offenderTypeCtrl?.value,
    )?.lookupKey;
    if (offenderTypeLookupKey === OffenderTypes.ClEARING_AGENT) {
      this.filteredPenaltySigners = this.penaltySigners.filter(
        lookupItem =>
          lookupItem.lookupKey ===
          PenaltySignerTypes.PRESIDENT_ASSISTANT_FOR_CUSTOMS_AFFAIRS_OR_COMMISSIONER,
      );
    } else if (offenderTypeLookupKey === OffenderTypes.EMPLOYEE) {
      this.filteredPenaltySigners = this.penaltySigners.filter(
        lookupItem =>
          lookupItem.lookupKey !==
          PenaltySignerTypes.PRESIDENT_ASSISTANT_FOR_CUSTOMS_AFFAIRS_OR_COMMISSIONER,
      );
    }
  }

  setFilteredOffenderLevels() {
    const penaltySignerValue: PenaltySignerTypes =
      this.penaltySignerCtrl?.value;
    switch (penaltySignerValue) {
      case PenaltySignerTypes.MANAGER_DIRECTOR:
        this.filteredOffenderLevels = this.offenderLevels.filter(
          lookupItem =>
            lookupItem.lookupKey === OffenderLevels.FOURTH_DEGREE_OR_LESS ||
            lookupItem.lookupKey ===
              OffenderLevels.THE_DEGREE_OF_UNDERSECRETARY_TO_THE_THIRD_DEGREE,
        );
        break;
      case PenaltySignerTypes.PRESIDENT_ASSISTANT:
        this.filteredOffenderLevels = this.offenderLevels.filter(
          lookupItem =>
            lookupItem.lookupKey === OffenderLevels.SECOND_DEGREE_OR_LESS ||
            lookupItem.lookupKey ===
              OffenderLevels.THE_DEGREE_OF_UNDERSECRETARY_TO_THE_FIRST_DEGREE,
        );
        break;
      case PenaltySignerTypes.PERMANENT_DISCIPLINARY_COUNCIL:
        this.filteredOffenderLevels = this.offenderLevels.filter(
          lookupItem =>
            lookupItem.lookupKey ===
              OffenderLevels.THE_DEGREE_OF_UNDERSECRETARY_TO_THE_FIRST_DEGREE ||
            lookupItem.lookupKey === OffenderLevels.SECOND_DEGREE_OR_LESS,
        );
        break;
      case PenaltySignerTypes.DISCIPLINARY_COMMITTEE:
        this.filteredOffenderLevels = this.offenderLevels.filter(
          lookupItem =>
            lookupItem.lookupKey === OffenderLevels.SECOND_DEGREE_OR_LESS,
        );
        break;
      default:
        break;
    }
  }

  setFilteredPenalties() {
    if (!this.showPenalties()) return;
    const penaltySigner = this.penaltySignerCtrl?.value;
    const offenderLevel = this.offenderLevelCtrl?.value;
    this.filteredPenalties = [];
    this.penaltyService
      .getFilteredPenalties({
        penaltySigner,
        offenderLevel,
      })
      .subscribe(data => {
        this.filteredPenalties = data;
        if (this.operation !== OperationType.CREATE) {
          this.setFilteredPenaltyGuidance();
        }
      });
  }

  get penaltyArrayCtrl() {
    return this.form.get('penaltyArray');
  }

  get offenderTypeCtrl() {
    return this.form.get('offenderType');
  }

  get penaltySignerCtrl() {
    return this.form.get('penaltySigner');
  }

  get offenderLevelCtrl() {
    return this.form.get('offenderLevel');
  }

  get penaltyGuidanceCtrl() {
    return this.form.get('penaltyGuidance');
  }

  get violationTypeCtrl() {
    return this.form.get('violationTypeId');
  }

  listenToSaveBulk() {
    this.saveBulk$
      .pipe(
        takeUntil(this.destroy$),
        switchMap(() => {
          const result = this._beforeSave();
          return isObservable(result) ? result : of(result);
        }),
      )
      .pipe(filter(value => value))
      .pipe(
        switchMap(() => {
          const result = this._prepareModel();
          return isObservable(result) ? result : of(result);
        }),
      )
      .pipe(
        exhaustMap(() => {
          return this.createBulk().pipe(
            catchError(error => {
              this._saveFail(error);
              return throwError(error);
            }),
            ignoreErrors(),
          );
        }),
      )
      .subscribe(() => {
        this._afterSave();
      });
  }

  createBulk(): Observable<ViolationPenalty[]> {
    const payloadArr: ViolationPenalty[] = [];
    this.penaltyArrayCtrl?.value.forEach((value: number) => {
      payloadArr.push({
        ...this.form.value,
        penaltyId: value,
        penaltyGuidance: this.filteredPenalties.find(
          p => p.id === this.form.value.penaltyGuidance,
        )?.isSystem
          ? PenaltyGuidances.NECESSARY_ASK_REFERRAL
          : PenaltyGuidances.APPROPRIATE,
      });
    });
    return this.violationPenaltyService.createBulkFull(
      payloadArr as unknown as ViolationPenalty[],
    );
  }
}
