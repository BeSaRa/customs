import { Component, OnInit, inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CrudDialogDataContract } from '@contracts/crud-dialog-data-contract';
import { JobTitle } from '@models/job-title';
import { AdminDialogComponent } from '@abstracts/admin-dialog-component';
import { UntypedFormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { OperationType } from '@enums/operation-type';
import { LookupService } from '@services/lookup.service';
import { LangService } from '@services/lang.service';
import { LangCodes } from '@enums/lang-codes';
import { StatusTypes } from '@enums/status-types';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { Lookup } from '@models/lookup';

@Component({
  selector: 'app-job-title-popup',
  templateUrl: './job-title-popup.component.html',
  styleUrls: ['./job-title-popup.component.scss'],
})
export class JobTitlePopupComponent
  extends AdminDialogComponent<JobTitle>
  implements OnInit
{
  form!: UntypedFormGroup;
  data: CrudDialogDataContract<JobTitle> = inject(MAT_DIALOG_DATA);
  jobTypes: Lookup[] = inject(LookupService).lookups.userType.filter(
    // exclude 'All' entry from lookupMaps that backend returns, waiting for Ebrahim to fix that
    (usertype) => usertype.lookupKey !== 3
  );
  jobStatus: Lookup[] = inject(LookupService).lookups.commonStatus.filter(
    // waiting for Ebrahim to filter deleted status
    (x) => x.lookupKey !== StatusTypes.DELETED
  );

  // getter and setter for form status control
  get status(): number {
    return this.form.get('status')?.value;
  }

  set status(val: number) {
    this.form.get('status')?.setValue(val);
  }

  _buildForm(): void {
    this.form = this.fb.group(this.model.buildForm(true));
  }

  protected override _afterBuildForm(): void {
    super._afterBuildForm();
    if (!this.status) this.status = 0; // since an undefined is passed to the OpenCreateDialog, we assume that the default status when creation is "inactive"
  }
  protected _beforeSave(): boolean | Observable<boolean> {
    this.form.markAllAsTouched();
    return this.form.valid;
  }

  protected _prepareModel(): JobTitle | Observable<JobTitle> {
    return new JobTitle().clone<JobTitle>({
      ...this.model,
      ...this.form.value,
    });
  }

  protected _afterSave(model: JobTitle): void {
    this.model = model;
    this.operation = OperationType.UPDATE;
    this.toast.success(
      this.lang.map.msg_save_x_success.change({ x: this.model.getNames() })
    );
    // you can close the dialog after save here
    this.dialogRef.close(this.model);
  }

  getJobTitleStatus(jobTitleStatus: number) {
    return this.jobStatus
      .find((status) => status.lookupKey === jobTitleStatus)
      ?.getNames();
  }
}
