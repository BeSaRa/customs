import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CrudDialogDataContract } from '@contracts/crud-dialog-data-contract';
import { Team } from '@models/team';
import { AdminDialogComponent } from '@abstracts/admin-dialog-component';
import { UntypedFormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { OperationType } from '@enums/operation-type';
import { OrganizationUnitService } from '@services/organization-unit.service';
import { OrganizationUnit } from '@models/organization-unit';
import { TeamNames } from '@enums/team-names';
import { InternalUser } from '@models/internal-user';
import { InternalUserService } from '@services/internal-user.service';
import { CustomValidators } from '@validators/custom-validators';

@Component({
  selector: 'app-team-popup',
  templateUrl: './team-popup.component.html',
  styleUrls: ['./team-popup.component.scss'],
})
export class TeamPopupComponent extends AdminDialogComponent<Team> {
  form!: UntypedFormGroup;
  data: CrudDialogDataContract<Team> = inject(MAT_DIALOG_DATA);
  organizationUnitService = inject(OrganizationUnitService);
  organizationUnits!: OrganizationUnit[];
  employeesOnDisciplinary!: InternalUser[];
  internalUserService = inject(InternalUserService);
  teamNames = TeamNames;

  protected override _init(): void {
    this.organizationUnitService
      .loadAsLookups()
      .subscribe(
        organizationUnits => (this.organizationUnits = organizationUnits),
      );
  }

  _buildForm(): void {
    this.form = this.fb.group(this.model.buildForm(true));
    this.form.controls['ldapGroupName'].disable();
  }

  protected override _afterBuildForm() {
    super._afterBuildForm();
    if (this.isDisciplinary()) {
      this.internalUserService
        .loadAsLookups()
        .subscribe(
          internalUsers => (this.employeesOnDisciplinary = internalUsers),
        );
      this.form.get('secretary')?.setValidators(CustomValidators.required);
      this.form.get('president')?.setValidators(CustomValidators.required);
    }
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
      this.lang.map.msg_save_x_success.change({ x: this.model.getNames() }),
    );
    this.dialogRef.close(this.model);
    // you can close the dialog after save here
    // this.dialogRef.close(this.model);
  }

  isDisciplinary() {
    return (
      this.form &&
      this.form.get('authName')?.value === this.teamNames.Disciplinary_Committee
    );
  }
}
