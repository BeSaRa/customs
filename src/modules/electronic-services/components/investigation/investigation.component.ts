import { Component, inject } from '@angular/core';
import { LangService } from '@services/lang.service';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { InvestigationService } from '@services/investigation.service';
import { Investigation } from '@models/investigation';
import { BaseCaseComponent } from '@abstracts/base-case-component';
import { SaveTypes } from '@enums/save-types';
import { OperationType } from '@enums/operation-type';
import { Observable } from 'rxjs';
import { CaseFolder } from '@models/case-folder';

@Component({
  selector: 'app-investigation',
  templateUrl: './investigation.component.html',
  styleUrls: ['./investigation.component.scss'],
})
export class InvestigationComponent extends BaseCaseComponent<Investigation, InvestigationService> {
  lang = inject(LangService);
  fb = inject(UntypedFormBuilder);
  form!: UntypedFormGroup;
  service = inject(InvestigationService);
  // mock data
  model: Investigation = new Investigation().clone<Investigation>({
    id: '{75388091-006E-CD67-8829-8AD3C1900000}',
    draftFullSerial: 'INV/PUB/2023/45',
    createdOn: '2023-09-26T23:09:53.680+00:00',
  });

  caseFolders: CaseFolder[] = [];

  getSecurityLevel(limitedAccess: boolean): string {
    return this.lang.map[limitedAccess as unknown as 'true' | 'false'];
  }

  _buildForm(): void {
    this.form = this.fb.group(this.model.buildForm(true));
  }

  _afterBuildForm(): void {
    //throw new Error('Method not implemented.');
  }

  _beforeSave(saveType: SaveTypes): boolean | Observable<boolean> {
    //throw new Error('Method not implemented.');
    return true;
  }

  _prepareModel(): Investigation | Observable<Investigation> {
    return new Investigation().clone<Investigation>({
      ...this.model,
      ...this.form.getRawValue(),
    });
  }

  _afterSave(model: Investigation, saveType: SaveTypes, operation: OperationType): void {
    this.model = model;
    // display success message based on operation and save type

    // if there is no folders load it
    if (!this.caseFolders.length) {
      this.model
        .getService()
        .loadCaseFolders(model.id)
        .subscribe(folders => (this.caseFolders = folders));
    }
  }

  _updateForm(model: Investigation): void {
    this.form.patchValue(model.buildForm());
  }
}
