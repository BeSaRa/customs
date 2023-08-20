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
  filteredPenaltySigners!: Lookup[];
  offenderLevels: Lookup[] = inject(LookupService).lookups.offenderLevel;
  filteredOffenderLevels!: Lookup[];
  penaltyGuidances: Lookup[] = inject(LookupService).lookups.penaltyGuidance;
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
    this.onOffenderTypeChange();
    this.onPenaltySignerChange();
    this.onOffenderLevelChange();
  }
  onOffenderLevelChange() {
    this.form.get('offenderLevel')?.valueChanges.subscribe(value => this.setFilteredPenalties());
  }
  onPenaltySignerChange() {
    this.form.get('penaltySigner')?.valueChanges.subscribe(value => {
      this.form.get('offenderLevel')?.setValue(null);
      this.setFilteredOffenderLevels(value);
      this.setFilteredPenalties();
    });
  }
  setFilteredOffenderLevels(value: PenaltySignerTypes) {
    switch (value) {
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
          lookupItem => lookupItem.lookupKey === OffenderLevels.THE_DEGREE_OF_UNDERSECRETARY_TO_THE_FIRST_DEGREE
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
    if (this.hasPenaltySignerAnOffenderLevel()) {
      this.filteredPenalties = [];
      this.penalties.forEach(penalty => {
        if (penalty.isSystem) {
          this.filteredPenalties.push(penalty);
        } else {
          penalty.detailsList.forEach(details => {
            if (details.penaltySigner === this.penaltySignerValue && details.offenderLevel === this.offenderLevelValue) {
              this.filteredPenalties.push(penalty);
            }
          });
        }
      });
    }
  }
  onOffenderTypeChange() {
    this.form.get('offenderType')?.valueChanges.subscribe(value => {
      const offenderTypeLookupKey = this.offenderTypes.find(offenderType => offenderType.id === value)?.lookupKey;
      if (offenderTypeLookupKey === OffenderTypes.BROKER) {
        this.filteredPenaltySigners = this.penaltySigners.filter(
          lookupItem => lookupItem.lookupKey === PenaltySignerTypes.PRESIDENT_ASSISTANT_FOR_CUSTOMS_AFFAIRS_OR_COMMISSIONER
        );
      } else if (offenderTypeLookupKey === OffenderTypes.EMPLOYEE) {
        this.filteredPenaltySigners = this.penaltySigners.filter(
          lookupItem => lookupItem.lookupKey !== PenaltySignerTypes.PRESIDENT_ASSISTANT_FOR_CUSTOMS_AFFAIRS_OR_COMMISSIONER
        );
      }
    });
  }
  needOffenderLevel(): any {
    const offenderTypeLookupKey = this.offenderTypes.find(offenderType => offenderType.id === this.offenderTypeValue)?.lookupKey;
    return this.offenderTypeValue && offenderTypeLookupKey === OffenderTypes.EMPLOYEE && this.penaltySignerValue;
  }
  hasPenaltySignerAnOffenderLevel(): any {
    return this.penaltySignerValue && this.offenderLevelValue;
  }
}
