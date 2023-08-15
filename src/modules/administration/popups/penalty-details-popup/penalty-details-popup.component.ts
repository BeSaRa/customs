import { Component, EventEmitter, Output, inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CrudDialogDataContract } from '@contracts/crud-dialog-data-contract';
import { PenaltyDetails } from '@models/penalty-details';
import { AdminDialogComponent } from '@abstracts/admin-dialog-component';
import { UntypedFormGroup } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { OperationType } from '@enums/operation-type';
import { Lookup } from '@models/lookup';
import { LookupService } from '@services/lookup.service';
import { LegalRuleService } from '@services/legal-rule.service';
import { LegalRule } from '@models/legal-rule';

@Component({
  selector: 'app-penalty-details-popup',
  templateUrl: './penalty-details-popup.component.html',
})
export class PenaltyDetailsPopupComponent extends AdminDialogComponent<PenaltyDetails> {
  form!: UntypedFormGroup;
  data: CrudDialogDataContract<PenaltyDetails> = inject(MAT_DIALOG_DATA);
  lookupService = inject(LookupService);
  legalRuleService = inject(LegalRuleService);

  _buildForm(): void {
    this.form = this.fb.group(this.model.buildForm(true));
  }

  protected _beforeSave(): boolean | Observable<boolean> {
    this.form.markAllAsTouched();
    return this.form.valid;
  }
  protected override _prepareModel(): PenaltyDetails | Observable<PenaltyDetails> {
    throw new Error('Method not implemented.');
  }
  protected override _afterSave(model: PenaltyDetails): void {
    throw new Error('Method not implemented.');
  }
  penaltySigners: Lookup[] = this.lookupService.lookups.penaltySigner;
  offenderLevels: Lookup[] = this.lookupService.lookups.offenderLevel;
  legalRules!: LegalRule[];

  protected override _initPopup(): void {
    super._initPopup();
    this.getLegalRules();
  }
  protected getLegalRules() {
    this.legalRuleService.loadAsLookups().subscribe(data => {
      this.legalRules = data;
    });
  }
  handelSave() {
    if (this._beforeSave()) {
      // add details to list
    }
    this.dialogRef.close(this.model);
  }
}
