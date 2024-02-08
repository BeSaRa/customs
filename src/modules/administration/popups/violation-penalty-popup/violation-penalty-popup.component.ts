import { Component, inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CrudDialogDataContract } from '@contracts/crud-dialog-data-contract';
import { ViolationPenalty } from '@models/violation-penalty';
import { AdminDialogComponent } from '@abstracts/admin-dialog-component';
import { FormControl, UntypedFormGroup } from '@angular/forms';
import {
  exhaustMap,
  filter,
  isObservable,
  Observable,
  of,
  Subject,
  switchMap,
  takeUntil,
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
import { PenaltyGuidances } from '@enums/penalty-guidances';

@Component({
  selector: 'app-violation-penalty-popup',
  templateUrl: './violation-penalty-popup.component.html',
  styleUrls: ['./violation-penalty-popup.component.scss'],
})
export class ViolationPenaltyPopupComponent
  extends AdminDialogComponent<ViolationPenalty>
  implements OnInit
{
  form!: UntypedFormGroup;
  data: CrudDialogDataContract<ViolationPenalty> = inject(MAT_DIALOG_DATA);
  violationPenaltyService = inject(ViolationPenaltyService);

  violationTypeService = inject(ViolationTypeService);
  violationTypes!: ViolationType[];

  offenderTypes: Lookup[] = inject(LookupService).lookups.offenderType;
  violationTypeId = this.data.extras?.violationType;
  offenderTypeId = this.data.extras?.offenderType;

  penaltyService = inject(PenaltyService);
  penalties: Penalty[] = [];
  filteredPenalties: Penalty[] = [];
  penaltyGuidance: Penalty[] = [];
  penaltiesOrReferral: Penalty[] = [];

  penaltySigners: Lookup[] = inject(LookupService).lookups.penaltySigner;
  filteredPenaltySigners: Lookup[] = this.penaltySigners;
  offenderLevels: Lookup[] = inject(LookupService).lookups.offenderLevel;
  filteredOffenderLevels: Lookup[] = this.offenderLevels;
  saveBulk$: Subject<void> = new Subject<void>();
  decisionType = new FormControl();

  decisionTypes: Lookup[] = inject(LookupService).lookups.decisionTypes;
  continue = false;

  protected override _initPopup(): void {
    super._initPopup();
    this.listenToSaveBulk();
    this.getViolationTypes();
    this.getPenalties();
  }

  protected getViolationTypes() {
    this.violationTypeService.loadAsLookups().subscribe(data => {
      this.violationTypes = data;
    });
  }

  protected getPenalties() {
    this.penaltyService.loadAsLookups().subscribe(data => {
      this.penalties = data;
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
    this.controls.violationTypeId()?.setValue(this.violationTypeId);
    this.controls.offenderType()?.setValue(this.offenderTypeId);
    this.controls.violationTypeId()?.disable();
    this.controls.offenderType()?.disable();
    this.setFilteredPenaltySigners();
    this.setFilteredPenalties();
    this.onPenaltySignerChange();
    this.setOffenderLevelValidity();
    this.onOffenderLevelChange();
    this.onPenaltiesChanges();
    this.onDecisionTypeChanges();
    if (this.inEditMode()) {
      this.setFilteredOffenderLevels();
    }
  }

  needOffenderLevel(): boolean {
    return (
      this.offenderTypeId === OffenderTypes.EMPLOYEE &&
      this.controls.penaltySigner()!.valid
    );
  }

  protected _afterSave(): void {
    this.operation = OperationType.UPDATE;
    this.toast.success(
      this.lang.map.msg_save_x_success.change({ x: this.model.getNames() }),
    );
    if (!this.continue) this.dialogRef.close(this.model);
    this.decisionType.setValue(null);
    this.controls.penaltyArray()?.setValue([]);
    this.controls.penaltyGuidance()?.setValue(null);
  }

  onPenaltySignerChange() {
    this.controls.penaltySigner()?.valueChanges.subscribe(() => {
      this.controls.offenderLevel()?.setValue(null);
      this.form.updateValueAndValidity();
      this.setFilteredOffenderLevels();
      this.setFilteredPenalties();
    });
  }

  onOffenderLevelChange() {
    this.controls.offenderLevel()?.valueChanges.subscribe(() => {
      this.setFilteredPenalties();
    });
  }

  onPenaltiesChanges() {
    this.controls.penaltyArray()?.valueChanges.subscribe(() => {
      this.setFilteredPenaltyGuidance();
    });
  }

  onDecisionTypeChanges() {
    this.decisionType?.valueChanges.subscribe(value => {
      if (value === 1) {
        this.penaltiesOrReferral = this.filteredPenalties.filter(
          penalty => penalty.isSystem,
        );
        this.controls.penaltyArray()?.setValue([]);
      } else if (value === 0) {
        this.penaltiesOrReferral = this.filteredPenalties.filter(
          penalty => !penalty.isSystem,
        );
        this.setSelectedPenalties();
      } else if (value === -1) {
        this.penaltiesOrReferral = this.filteredPenalties;
        this.setSelectedPenalties();
      }
    });
  }

  setOffenderLevelValidity() {
    if (this.controls.offenderType()?.value === OffenderTypes.EMPLOYEE) {
      this.controls.offenderLevel()?.setValidators(CustomValidators.required);
    }
  }

  setFilteredPenaltyGuidance() {
    if (!this.filteredPenalties.length || !this.controls.penaltyArray()?.valid)
      return;
    this.penaltyGuidance = (
      this.controls.penaltyArray()?.value as number[]
    ).map(penaltyId => this.filteredPenalties.find(p => p.id === penaltyId)!);
    if (this.model.penaltyGuidance === PenaltyGuidances.APPROPRIATE) {
      this.controls.penaltyGuidance()?.setValue(this.model.penaltyArray[0]);
    }
  }

  showPenalties() {
    return (
      this.controls.penaltySigner()?.value &&
      this.controls.offenderLevel()?.value
    );
  }

  showPenaltyGuidance() {
    return (this.controls.penaltyArray()?.value as number[]).length > 0;
  }

  setFilteredPenaltySigners() {
    if (this.offenderTypeId === OffenderTypes.ClEARING_AGENT) {
      this.filteredPenaltySigners = this.penaltySigners.filter(
        lookupItem =>
          lookupItem.lookupKey ===
          PenaltySignerTypes.PRESIDENT_ASSISTANT_FOR_CUSTOMS_AFFAIRS_OR_COMMISSIONER,
      );
      this.controls
        .penaltySigner()
        ?.setValue(
          PenaltySignerTypes.PRESIDENT_ASSISTANT_FOR_CUSTOMS_AFFAIRS_OR_COMMISSIONER,
        );
      this.controls.penaltySigner()?.disable();
    } else if (this.offenderTypeId === OffenderTypes.EMPLOYEE) {
      this.filteredPenaltySigners = this.penaltySigners.filter(
        lookupItem =>
          lookupItem.lookupKey !==
            PenaltySignerTypes.PRESIDENT_ASSISTANT_FOR_CUSTOMS_AFFAIRS_OR_COMMISSIONER &&
          lookupItem.lookupKey !==
            PenaltySignerTypes.PERMANENT_DISCIPLINARY_COUNCIL,
      );
    }
  }

  setFilteredOffenderLevels() {
    if (!this.needOffenderLevel()) return;
    const penaltySignerValue = this.controls.penaltySigner()?.value;
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
    this.filteredPenalties = [];
    if (this.offenderTypeId === OffenderTypes.ClEARING_AGENT) {
      this.penaltyService.loadComposite().subscribe(data => {
        this.filteredPenalties = data.rs.filter(
          penalty => penalty.offenderType === OffenderTypes.ClEARING_AGENT,
        );
        this.penaltiesOrReferral = this.filteredPenalties;

        if (this.inCreateMode()) {
          this.setSelectedPenalties();
        }
      });
    } else if (
      this.offenderTypeId === OffenderTypes.EMPLOYEE &&
      this.showPenalties()
    ) {
      const penaltySigner = this.controls.penaltySigner()?.value;
      const offenderLevel = this.controls.offenderLevel()?.value;
      this.penaltyService
        .getFilteredPenalties({
          penaltySigner,
          offenderLevel,
        })
        .subscribe(data => {
          this.filteredPenalties = data;
          this.setFilteredPenaltyGuidance();
          if (this.inEditMode()) this.setDecisionTypeValue();
        });
    }
  }

  setDecisionTypeValue() {
    const penalty = this.filteredPenalties.find(
      penalty => penalty.id === this.model.penaltyId,
    );
    this.decisionType.setValue(penalty?.isSystem ? 1 : 0);
  }

  setSelectedPenalties() {
    const ids = this.filteredPenalties
      .filter(penalty => !penalty.isSystem)
      .map(penalty => penalty.id);
    this.controls.penaltyArray()?.setValue(ids);
  }

  controls = {
    violationTypeId: () => this.form.get('violationTypeId'),
    penaltyGuidance: () => this.form.get('penaltyGuidance'),
    offenderLevel: () => this.form.get('offenderLevel'),
    penaltySigner: () => this.form.get('penaltySigner'),
    offenderType: () => this.form.get('offenderType'),
    penaltyArray: () => this.form.get('penaltyArray'),
    repeat: () => this.form.get('repeat'),
  };

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
          return this.createBulk();
        }),
      )
      .subscribe(() => {
        this._afterSave();
      });
  }

  createBulk(): Observable<ViolationPenalty[]> {
    const payloadArr: ViolationPenalty[] = [];
    const selectedPenaltyGuidance = this.penalties.find(
      penalty => penalty.id === this.controls.penaltyGuidance()?.value,
    );
    const { penaltyArray: _penaltyArray, ...formValueWithoutPenaltyArray } =
      this.form.value;
    this.controls.penaltyArray()?.value.forEach((value: number) => {
      payloadArr.push({
        ...formValueWithoutPenaltyArray,
        penaltyId: value,
        repeat: this.controls.repeat()?.value,
        penaltySigner: this.controls.penaltySigner()?.value,
        violationTypeId: this.violationTypeId,
        offenderType: this.offenderTypeId,
        status: 1,
        penaltyGuidance:
          selectedPenaltyGuidance?.id === value
            ? selectedPenaltyGuidance.isSystem
              ? PenaltyGuidances.NECESSARY_ASK_REFERRAL
              : PenaltyGuidances.APPROPRIATE
            : null,
      });
    });
    return this.violationPenaltyService.createBulkFull(
      payloadArr as unknown as ViolationPenalty[],
    );
  }

  showDecisionType() {
    return (
      this.controls.penaltySigner()?.valid &&
      this.controls.offenderLevel()?.valid
    );
  }
}
