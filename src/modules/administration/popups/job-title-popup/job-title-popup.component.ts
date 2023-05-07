import { Component, inject } from '@angular/core';
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
import { JobTitleService } from '@services/job-title.service';
import { StatusTypes } from '@enums/status-types';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';

@Component({
  selector: 'app-job-title-popup',
  templateUrl: './job-title-popup.component.html',
  styleUrls: ['./job-title-popup.component.scss'],
})
export class JobTitlePopupComponent extends AdminDialogComponent<JobTitle> {
  form!: UntypedFormGroup;
  data: CrudDialogDataContract<JobTitle> = inject(MAT_DIALOG_DATA);


  jobTypes: any[] = inject(LookupService).lookups.userType;
  jobStatus: any[] = inject(LookupService).lookups.commonStatus.filter(x => x.lookupKey != StatusTypes.DELETED);
  isArabic = inject(LangService).getCurrent().code === LangCodes.AR;

  isActive(): boolean {
    return this.model.status! === StatusTypes.ACTIVE;
  }

  // toggleStatus(value: MatSlideToggleChange) {
  //   const { checked } = value;
  //   this.model.status = checked ? 1 : 0;
  // }

  _buildForm(): void {
    this.form = this.fb.group(this.model.buildForm(true));
  }

  protected _beforeSave(): boolean | Observable<boolean> {
    console.log("model", this.model)
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
}
