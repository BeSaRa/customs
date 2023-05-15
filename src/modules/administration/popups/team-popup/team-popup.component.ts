import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CrudDialogDataContract } from '@contracts/crud-dialog-data-contract';
import { Team } from '@models/team';
import { AdminDialogComponent } from '@abstracts/admin-dialog-component';
import { UntypedFormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { OperationType } from '@enums/operation-type';

@Component({
  selector: 'app-team-popup',
  templateUrl: './team-popup.component.html',
  styleUrls: ['./team-popup.component.scss'],
})
export class TeamPopupComponent extends AdminDialogComponent<Team> {
  form!: UntypedFormGroup;
  data: CrudDialogDataContract<Team> = inject(MAT_DIALOG_DATA);

  _buildForm(): void {
    this.form = this.fb.group(this.model.buildForm(true));
  }

  protected _beforeSave(): boolean | Observable<boolean> {
    this.form.markAllAsTouched();
    return this.form.valid;
  }

  protected _prepareModel(): Team | Observable<Team> {
    return new Team().clone<Team>({
      ...this.model,
      ...this.form.value,
    });
  }

  protected _afterSave(model: Team): void {
    this.model = model;
    this.operation = OperationType.UPDATE;
    this.toast.success(
      this.lang.map.msg_save_x_success.change({ x: this.model.getNames() })
    );
    this.dialogRef.close(this.model);
    // you can close the dialog after save here
    // this.dialogRef.close(this.model);
  }
}
