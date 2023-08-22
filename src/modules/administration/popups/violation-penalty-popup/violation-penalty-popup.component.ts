import { Component, inject } from '@angular/core';
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
import { PenaltyGuidances } from '@enums/penalty-guidances';

@Component({
  selector: 'app-violation-penalty-popup',
  templateUrl: './violation-penalty-popup.component.html',
  styleUrls: ['./violation-penalty-popup.component.scss'],
})
export class ViolationPenaltyPopupComponent extends AdminDialogComponent<ViolationPenalty> {
  form!: UntypedFormGroup;
  data: CrudDialogDataContract<ViolationPenalty> = inject(MAT_DIALOG_DATA);

  violationTypeService = inject(ViolationTypeService);
  violationTypes!: ViolationType[];

  penaltyService = inject(PenaltyService);
  penalties!: Penalty[];
  filteredPenalties!: Penalty[];

  penaltySigners: Lookup[] = inject(LookupService).lookups.penaltySigner;
  filteredPenaltySigners: Lookup[] = this.penaltySigners;
  offenderLevels: Lookup[] = inject(LookupService).lookups.offenderLevel;
  filteredOffenderLevels: Lookup[] = this.offenderLevels;
  penaltyGuidances: Lookup[] = inject(LookupService).lookups.penaltyGuidance;
  filteredPenaltyGuidances: Lookup[] = this.penaltyGuidances;
  offenderTypes: Lookup[] = inject(LookupService).lookups.offenderType;

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
      this.filteredPenalties = data;
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

  protected _afterSave(model: ViolationPenalty): void {
    this.model = model;
    this.operation = OperationType.UPDATE;
    this.toast.success(this.lang.map.msg_save_x_success.change({ x: this.model.getNames() }));
    // you can close the dialog after save here
    this.dialogRef.close(this.model);
  }

  get offenderTypeValue() {
    return this.form.get('offenderType')?.value;
  }

  get penaltySignerValue() {
    return this.form.get('penaltySigner')?.value;
  }

  get offenderLevelValue() {
    return this.form.get('offenderLevel')?.value;
  }

  protected override _afterBuildForm(): void {
    super._afterBuildForm();
    this.onOffenderTypeChange();
    this.onPenaltySignerChange();
    this.onOffenderLevelChange();
  }

  onPenaltySignerChange() {
    this.form.get('penaltySigner')?.valueChanges.subscribe(() => {
      this.form.get('offenderLevel')?.setValue(null);
      this.form.get('penaltyId')?.setValue(null);
      this.form.get('penaltyGuidance')?.setValue(null);
      this.setFilteredOffenderLevels();
      this.setFilteredPenalties();
      this.setFilteredPenaltyGuidances();
    });
  }
  onOffenderLevelChange() {
    this.form.get('offenderLevel')?.valueChanges.subscribe(() => {
      this.form.get('penaltyId')?.setValue(null);
      this.form.get('penaltyGuidance')?.setValue(null);
      this.setFilteredPenalties();
      this.setFilteredPenaltyGuidances();
    });
  }

  onOffenderTypeChange() {
    this.form.get('offenderType')?.valueChanges.subscribe(() => {
      this.form.get('penaltySigners')?.setValue(null);
      this.setFilteredPenaltySigners();
    });
  }

  needOffenderLevel(): any {
    const offenderTypeLookupKey = this.offenderTypes.find(offenderType => offenderType.lookupKey === this.offenderTypeValue)?.lookupKey;
    return this.offenderTypeValue && offenderTypeLookupKey === OffenderTypes.EMPLOYEE && this.penaltySignerValue;
  }

  showPenaltiesAndPenaltyGuidances() {
    return (
      (this.penaltySignerValue && this.offenderLevelValue) ||
      this.penaltySignerValue === PenaltySignerTypes.PRESIDENT_ASSISTANT_FOR_CUSTOMS_AFFAIRS_OR_COMMISSIONER
    );
  }

  setFilteredPenaltySigners() {
    const offenderTypeLookupKey = this.offenderTypes.find(offenderType => offenderType.lookupKey === this.offenderTypeValue)?.lookupKey;
    if (offenderTypeLookupKey === OffenderTypes.BROKER) {
      this.filteredPenaltySigners = this.penaltySigners.filter(
        lookupItem => lookupItem.lookupKey === PenaltySignerTypes.PRESIDENT_ASSISTANT_FOR_CUSTOMS_AFFAIRS_OR_COMMISSIONER
      );
    } else if (offenderTypeLookupKey === OffenderTypes.EMPLOYEE) {
      this.filteredPenaltySigners = this.penaltySigners.filter(
        lookupItem => lookupItem.lookupKey !== PenaltySignerTypes.PRESIDENT_ASSISTANT_FOR_CUSTOMS_AFFAIRS_OR_COMMISSIONER
      );
    }
  }

  setFilteredOffenderLevels() {
    const penaltySignerValue: PenaltySignerTypes = this.penaltySignerValue;
    switch (penaltySignerValue) {
      case PenaltySignerTypes.MANAGER_DIRECTOR:
        this.filteredOffenderLevels = this.offenderLevels.filter(
          lookupItem =>
            lookupItem.lookupKey === OffenderLevels.FOURTH_DEGREE_OR_LESS ||
            lookupItem.lookupKey === OffenderLevels.THE_DEGREE_OF_UNDERSECRETARY_TO_THE_THIRD_DEGREE
        );
        break;
      case PenaltySignerTypes.PRESIDENT_ASSISTANT:
        this.filteredOffenderLevels = this.offenderLevels.filter(
          lookupItem =>
            lookupItem.lookupKey === OffenderLevels.SECOND_DEGREE_OR_LESS ||
            lookupItem.lookupKey === OffenderLevels.THE_DEGREE_OF_UNDERSECRETARY_TO_THE_FIRST_DEGREE
        );
        break;
      case PenaltySignerTypes.PERMANENT_DISCIPLINARY_COUNCIL:
        this.filteredOffenderLevels = this.offenderLevels.filter(
          lookupItem =>
            lookupItem.lookupKey === OffenderLevels.THE_DEGREE_OF_UNDERSECRETARY_TO_THE_FIRST_DEGREE ||
            lookupItem.lookupKey === OffenderLevels.SECOND_DEGREE_OR_LESS
        );
        break;
      case PenaltySignerTypes.DISCIPLINARY_COMMITTEE:
        this.filteredOffenderLevels = this.offenderLevels.filter(lookupItem => lookupItem.lookupKey === OffenderLevels.SECOND_DEGREE_OR_LESS);
        break;
      default:
        break;
    }
  }

  setFilteredPenalties() {
    if (!this.showPenaltiesAndPenaltyGuidances()) return;
    this.filteredPenalties = [];
    this.penalties.forEach(penalty => {
      if (penalty.isSystem) this.filteredPenalties.push(penalty);
      else {
        penalty.detailsList.forEach(detail => {
          if (detail.offenderLevel === this.offenderLevelValue && detail.penaltySigner === this.penaltySignerValue) {
            this.filteredPenalties.push(penalty);
          }
        });
      }
    });
  }

  setFilteredPenaltyGuidances() {
    if (!this.showPenaltiesAndPenaltyGuidances()) return;
    const penaltySignerValue: PenaltySignerTypes = this.penaltySignerValue;
    const offenderLevelValue: OffenderLevels = this.offenderLevelValue;
    switch (penaltySignerValue) {
      case PenaltySignerTypes.MANAGER_DIRECTOR:
        if (offenderLevelValue === OffenderLevels.THE_DEGREE_OF_UNDERSECRETARY_TO_THE_THIRD_DEGREE) {
          this.filteredPenaltyGuidances = this.penaltyGuidances.filter(
            lookupItem => lookupItem.lookupKey === PenaltyGuidances.NECESSARY_ASK_REFERRAL
          );
        } else if (offenderLevelValue === OffenderLevels.FOURTH_DEGREE_OR_LESS) {
          this.filteredPenaltyGuidances = this.penaltyGuidances.filter(
            lookupItem => lookupItem.lookupKey === PenaltyGuidances.APPROPRIATE || lookupItem.lookupKey === PenaltyGuidances.NECESSARY_ASK_REFERRAL
          );
        }
        break;
      case PenaltySignerTypes.PRESIDENT_ASSISTANT:
        if (offenderLevelValue === OffenderLevels.THE_DEGREE_OF_UNDERSECRETARY_TO_THE_FIRST_DEGREE) {
          this.filteredPenaltyGuidances = this.penaltyGuidances.filter(
            lookupItem =>
              lookupItem.lookupKey === PenaltyGuidances.APPROPRIATE ||
              lookupItem.lookupKey === PenaltyGuidances.REFERRAL_TO_THE_PERMANENT_DISCIPLINARY_COUNCIL
          );
        } else if (offenderLevelValue === OffenderLevels.SECOND_DEGREE_OR_LESS) {
          this.filteredPenaltyGuidances = this.penaltyGuidances.filter(
            lookupItem =>
              lookupItem.lookupKey === PenaltyGuidances.APPROPRIATE ||
              lookupItem.lookupKey === PenaltyGuidances.REFERRAL_TO_THE_DISCIPLINARY_COMMITTEE
          );
        }
        break;
      case PenaltySignerTypes.DISCIPLINARY_COMMITTEE:
        if (offenderLevelValue === OffenderLevels.SECOND_DEGREE_OR_LESS) {
          this.filteredPenaltyGuidances = this.penaltyGuidances.filter(lookupItem => lookupItem.lookupKey === PenaltyGuidances.APPROPRIATE);
        }
        break;
      case PenaltySignerTypes.PERMANENT_DISCIPLINARY_COUNCIL:
        this.filteredPenaltyGuidances = [];
        break;
      case PenaltySignerTypes.PRESIDENT_ASSISTANT_FOR_CUSTOMS_AFFAIRS_OR_COMMISSIONER:
        this.filteredPenaltyGuidances = this.penaltyGuidances.filter(lookupItem => lookupItem.lookupKey === PenaltyGuidances.APPROPRIATE);
        break;
      default:
        break;
    }
  }
}
