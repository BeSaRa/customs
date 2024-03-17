import { Component, inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CrudDialogDataContract } from '@contracts/crud-dialog-data-contract';
import { ViolationPenalty } from '@models/violation-penalty';
import { AdminDialogComponent } from '@abstracts/admin-dialog-component';
import { UntypedFormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
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

  violationTypeService = inject(ViolationTypeService);
  violationTypes!: ViolationType[];
  lookups = inject(LookupService).lookups;
  offenderTypes: Lookup[] = this.lookups.offenderType;

  penaltyService = inject(PenaltyService);
  penalties: Penalty[] = [];
  filteredPenalties: Penalty[] = [];
  penaltyGuidance: Lookup[] = this.lookups.penaltyGuidance;

  penaltySigners: Lookup[] = this.lookups.penaltySigner;
  filteredPenaltySigners: Lookup[] = this.penaltySigners;
  offenderLevels: Lookup[] = this.lookups.offenderLevel;
  filteredOffenderLevels: Lookup[] = this.offenderLevels;

  continue = false;

  protected override _initPopup(): void {
    super._initPopup();
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
      ...this.form.getRawValue(),
    });
  }

  protected override _afterBuildForm(): void {
    super._afterBuildForm();
    this.controls.violationTypeId()?.setValue(this.data.extras?.violationType);
    this.controls.offenderType()?.setValue(this.data.extras?.offenderType);
    this.controls.violationTypeId()?.disable({ emitEvent: false });
    this.controls.offenderType()?.disable({ emitEvent: false });
    this.setFilteredPenaltySigners();
    this.setFilteredPenalties();
    this.onPenaltySignerChange();
    this.onPenaltyChange();
    this.setOffenderLevelValidity();
    this.onOffenderLevelChange();
    if (!this.inCreateMode()) {
      this.setFilteredOffenderLevels();
    }
  }

  showOffenderLevel(): boolean {
    return (
      this.controls.offenderType()?.value === OffenderTypes.EMPLOYEE &&
      (this.controls.penaltySigner()!.valid ||
        this.operation === OperationType.VIEW)
    );
  }

  showPenaltyGuidance(): boolean {
    return (
      (!!this.controls.penaltyId()?.valid ||
        this.operation === OperationType.VIEW) &&
      !!this.filteredPenalties.length
    );
  }

  protected _afterSave(): void {
    this.operation = OperationType.UPDATE;
    this.toast.success(
      this.lang.map.msg_save_x_success.change({ x: this.model.getNames() }),
    );
    if (!this.continue) this.dialogRef.close(this.model);
  }

  onPenaltySignerChange() {
    this.controls.penaltySigner()?.valueChanges.subscribe(() => {
      this.controls.offenderLevel()?.setValue(null);
      this.controls.penaltyGuidance()?.setValue(null);
      this.controls.penaltyId()?.setValue(null);
      this.form.updateValueAndValidity();
      this.setFilteredOffenderLevels();
      this.setFilteredPenalties();
    });
  }

  onPenaltyChange() {
    this.controls.penaltyId()?.valueChanges.subscribe(value => {
      this.penaltyGuidance = this.lookups.penaltyGuidance.filter(
        pg => pg.lookupKey === PenaltyGuidances.APPROPRIATE,
      );
      this.controls.penaltyGuidance()?.disable({ emitEvent: false });
      this.controls.penaltyGuidance()?.setValue(PenaltyGuidances.APPROPRIATE);
      const isSystemPenalty = !!this.filteredPenalties.find(
        penalty => penalty.id === value,
      )?.isSystem;
      const isManager =
        this.controls.penaltySigner()?.value ===
        PenaltySignerTypes.MANAGER_DIRECTOR;
      if (isManager && isSystemPenalty) {
        this.penaltyGuidance = this.lookups.penaltyGuidance;
        this.controls.penaltyGuidance()?.enable({ emitEvent: false });
      }
    });
  }

  onOffenderLevelChange() {
    this.controls.offenderLevel()?.valueChanges.subscribe(() => {
      this.controls.penaltyGuidance()?.setValue(null);
      this.controls.penaltyId()?.setValue(null);
      this.form.updateValueAndValidity();
      this.setFilteredPenalties();
    });
  }

  setOffenderLevelValidity() {
    if (this.controls.offenderType()?.value === OffenderTypes.EMPLOYEE) {
      this.controls.offenderLevel()?.setValidators(CustomValidators.required);
    }
  }

  showPenalties() {
    return (
      this.controls.penaltySigner()?.value &&
      this.controls.offenderLevel()?.value
    );
  }

  setFilteredPenaltySigners() {
    if (this.controls.offenderType()?.value === OffenderTypes.BROKER) {
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
    } else if (this.controls.offenderType()?.value === OffenderTypes.EMPLOYEE) {
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
    if (!this.showOffenderLevel()) return;
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
    if (this.controls.offenderType()?.value === OffenderTypes.BROKER) {
      this.penaltyService.loadComposite().subscribe(data => {
        this.filteredPenalties = data.rs.filter(
          penalty => penalty.offenderType === OffenderTypes.BROKER,
        );
        this.filterPenaltyGuidances();
      });
    } else if (
      this.controls.offenderType()?.value === OffenderTypes.EMPLOYEE &&
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
          this.filterPenaltyGuidances();
        });
    }
  }

  filterPenaltyGuidances() {
    this.penaltyGuidance = this.lookups.penaltyGuidance.filter(
      pg => pg.lookupKey === PenaltyGuidances.APPROPRIATE,
    );
    this.controls.penaltyGuidance()?.disable({ emitEvent: false });
    this.controls.penaltyGuidance()?.setValue(PenaltyGuidances.APPROPRIATE);
    const isSystemPenalty = !!this.filteredPenalties.find(
      penalty => penalty.id === this.data.model.penaltyId,
    )?.isSystem;
    const isManager =
      this.data.model.penaltySigner === PenaltySignerTypes.MANAGER_DIRECTOR;
    if (isManager && isSystemPenalty) {
      this.penaltyGuidance = this.lookups.penaltyGuidance;
      this.controls.penaltyGuidance()?.enable({ emitEvent: false });
    }
  }

  controls = {
    violationTypeId: () => this.form.get('violationTypeId'),
    penaltyGuidance: () => this.form.get('penaltyGuidance'),
    offenderLevel: () => this.form.get('offenderLevel'),
    penaltySigner: () => this.form.get('penaltySigner'),
    offenderType: () => this.form.get('offenderType'),
    repeat: () => this.form.get('repeat'),
    penaltyId: () => this.form.get('penaltyId'),
  };
}
