import { AdminDialogComponent } from '@abstracts/admin-dialog-component';
import { Component, inject } from '@angular/core';
import { FormArray, FormControl, UntypedFormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CrudDialogDataContract } from '@contracts/crud-dialog-data-contract';
import { LangContract } from '@contracts/lang-contract';
import { UserPreferences } from '@models/user-preferences';
import { LangService } from '@services/lang.service';
import { LookupService } from '@services/lookup.service';
import { Observable } from 'rxjs';
import { CustomValidators } from '@validators/custom-validators';

@Component({
  selector: 'app-user-preferences-popup',
  templateUrl: './user-preferences-popup.component.html',
  styleUrls: ['./user-preferences-popup.component.scss'],
})
export class UserPreferencesPopupComponent extends AdminDialogComponent<UserPreferences> {
  form!: UntypedFormGroup;
  data: CrudDialogDataContract<UserPreferences> = inject(MAT_DIALOG_DATA);
  //user!: InternalUser;
  lookupService = inject(LookupService);
  langService = inject(LangService);
  arName!: string;
  enName!: string;
  empNum!: string;
  qid!: string;
  phoneNumber!: string;
  email!: string;
  languages: LangContract[] = this.langService.languages;

  override _buildForm(): void {
    const formObj = this.model.buildForm(true);
    const alternateEmailListParsed = ((formObj.alternateEmailListParsed as string[]) ?? []).map(
      email => new FormControl(email, [CustomValidators.required, CustomValidators.pattern('EMAIL')])
    );
    const formModel = { ...formObj, alternateEmailListParsed: this.fb.array(alternateEmailListParsed) };
    this.form = this.fb.group(formModel);
  }

  get alternateEmailListParsed() {
    return this.form.get('alternateEmailListParsed') as FormArray;
  }

  addAltEmail() {
    this.alternateEmailListParsed.push(new FormControl('', [CustomValidators.required, CustomValidators.pattern('EMAIL')]));
  }

  deleteEmail(i: number) {
    this.alternateEmailListParsed.removeAt(i);
  }

  protected override _beforeSave(): boolean | Observable<boolean> {
    this.form.markAllAsTouched();
    return this.form.valid;
  }

  protected override _prepareModel(): UserPreferences | Observable<UserPreferences> {
    return new UserPreferences().clone<UserPreferences>({
      //...this.model,
      ...this.form.value,
    });
  }

  protected override _init(): void {
    //this.user = this.data.extras?.['user'] as InternalUser;
    //popup extras
    this.arName = this.data.extras?.['arName'] as string;
    this.enName = this.data.extras?.['enName'] as string;
    this.empNum = this.data.extras?.['empNum'] as string;
    this.qid = this.data.extras?.['qid'] as string;
    this.phoneNumber = this.data.extras?.['phoneNumber'] as string;
    this.email = this.data.extras?.['email'] as string;
  }

  protected override _afterSave(model: UserPreferences): void {
    this.model = model;
    //this.toast.success(this.lang.map.msg_save_x_success.change({ x: this.model.getNames() }));
  }
}
