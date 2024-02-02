import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CrudDialogDataContract } from '@contracts/crud-dialog-data-contract';
import { PenaltyDetails } from '@models/penalty-details';
import { AdminDialogComponent } from '@abstracts/admin-dialog-component';
import { UntypedFormGroup } from '@angular/forms';
import {
  filter,
  isObservable,
  Observable,
  of,
  switchMap,
  takeUntil,
} from 'rxjs';
import { OperationType } from '@enums/operation-type';
import { Lookup } from '@models/lookup';
import { LookupService } from '@services/lookup.service';
import { LegalRuleService } from '@services/legal-rule.service';
import { LegalRule } from '@models/legal-rule';
import { AdminResult } from '@models/admin-result';
import { CustomValidators } from '@validators/custom-validators';
import { PenaltySignerTypes } from '@enums/penalty-signer-types';
import { OffenderLevels } from '@enums/offender-levels';

@Component({
  selector: 'app-penalty-details-popup',
  templateUrl: './penalty-details-popup.component.html',
})
export class PenaltyDetailsPopupComponent extends AdminDialogComponent<PenaltyDetails> {
  form!: UntypedFormGroup;
  data: CrudDialogDataContract<PenaltyDetails> = inject(MAT_DIALOG_DATA);

  lookupService = inject(LookupService);

  legalRuleService = inject(LegalRuleService);
  penaltySigners: Lookup[] = this.lookupService.lookups.penaltySigner;
  offenderLevels: Lookup[] = this.lookupService.lookups.offenderLevel;
  filteredOffenderLevels: Lookup[] = this.lookupService.lookups.offenderLevel;
  legalRules!: LegalRule[];
  isEmployee = this.data.extras?.isEmployee;

  protected override _initPopup(): void {
    super._initPopup();
    this.getLegalRules();
  }

  _buildForm(): void {
    this.form = this.fb.group(this.model.buildForm(true));
  }

  protected override _afterBuildForm() {
    super._afterBuildForm();
    if (!this.isEmployee) {
      this.offenderLevel?.clearValidators();
      this.penaltySigner?.setValue(
        PenaltySignerTypes.PRESIDENT_ASSISTANT_FOR_CUSTOMS_AFFAIRS_OR_COMMISSIONER,
      );
      this.penaltySigners = this.penaltySigners.filter(
        penaltySigner =>
          penaltySigner.lookupKey ===
          PenaltySignerTypes.PRESIDENT_ASSISTANT_FOR_CUSTOMS_AFFAIRS_OR_COMMISSIONER,
      );
    } else {
      this.penaltySigners = this.penaltySigners.filter(
        penaltySigner =>
          penaltySigner.lookupKey !==
          PenaltySignerTypes.PRESIDENT_ASSISTANT_FOR_CUSTOMS_AFFAIRS_OR_COMMISSIONER,
      );
      this.offenderLevel?.setValidators(CustomValidators.required);
    }
    this.form.updateValueAndValidity();
    this.listenToPenaltySignerChange();
    if (this.operation === OperationType.UPDATE) {
      this.setFilteredOffenderLevels();
    }
  }

  protected _beforeSave(): boolean | Observable<boolean> {
    this.form.markAllAsTouched();
    return this.form.valid;
  }

  protected override _prepareModel():
    | PenaltyDetails
    | Observable<PenaltyDetails> {
    this.model.penaltySignerInfo = new AdminResult().clone<AdminResult>(
      this.penaltySigners.find(
        ps => ps.lookupKey === this.penaltySigner?.value,
      ),
    );
    this.model.offenderLevelInfo = new AdminResult().clone<AdminResult>(
      this.offenderLevels.find(
        ol => ol.lookupKey === this.offenderLevel?.value,
      ),
    );
    this.model.legalRuleInfo = new AdminResult().clone<AdminResult>(
      this.legalRules.find(lr => lr.id === this.legalRule?.value),
    );

    return new PenaltyDetails().clone<PenaltyDetails>({
      ...this.model,
      ...this.form.value,
    });
  }

  protected override _afterSave(model: PenaltyDetails): void {
    this.model = model;
    this.operation = OperationType.UPDATE;
    this.dialogRef.close(this.model);
  }

  protected getLegalRules() {
    this.legalRuleService.loadAsLookups().subscribe(data => {
      this.legalRules = data;
    });
  }

  protected override _listenToSave() {
    this.save$
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
      .subscribe(model => {
        this._afterSave(model);
      });
  }

  setFilteredOffenderLevels() {
    const penaltySignerValue: PenaltySignerTypes = this.penaltySigner?.value;
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

  listenToPenaltySignerChange() {
    this.form.get('penaltySigner')?.valueChanges.subscribe(() => {
      this.form.get('offenderLevel')?.setValue(null);
      this.setFilteredOffenderLevels();
    });
  }

  get penaltySigner() {
    return this.form.get('penaltySigner');
  }

  get legalRule() {
    return this.form.get('legalRule');
  }

  get offenderLevel() {
    return this.form.get('offenderLevel');
  }
}
