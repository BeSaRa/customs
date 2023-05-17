import { AdminDialogComponent } from '@abstracts/admin-dialog-component';
import { Component, inject } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CrudDialogDataContract } from '@contracts/crud-dialog-data-contract';
import { InternalUser } from '@models/internal-user';
import { UserPreferences } from '@models/user-preferences';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-user-preferences-popup',
  templateUrl: './user-preferences-popup.component.html',
  styleUrls: ['./user-preferences-popup.component.scss']
})
export class UserPreferencesPopupComponent extends AdminDialogComponent<UserPreferences> {
  user!:InternalUser
  
  override _buildForm(): void {    
    // this.form = this.fb.group(this.model.buildForm(true));
  }
  protected override _beforeSave(): boolean | Observable<boolean> {
    this.form.markAllAsTouched();
    return this.form.valid;
  }
  protected override _prepareModel(): UserPreferences | Observable<UserPreferences> {
    return new UserPreferences().clone<UserPreferences>({
      ...this.model,
      ...this.form.value,
    });
  }
  
  protected override _init(): void {
    this.user = this.data.extras?.['user'] as InternalUser
  }

  protected override _afterSave(model: UserPreferences): void {
    this.model = model;
    this.toast.success(
      this.lang.map.msg_save_x_success.change({ x: this.model.getNames() })
    );
  }
  form!: UntypedFormGroup;
  data: CrudDialogDataContract<UserPreferences> = inject(MAT_DIALOG_DATA);
}
