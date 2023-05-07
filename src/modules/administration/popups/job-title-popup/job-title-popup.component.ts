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

  jobTypes: Lookup[] = inject(LookupService).lookups.userType;
  jobStatus: Lookup[] = inject(LookupService).lookups.commonStatus.filter(
    (x) => x.lookupKey != StatusTypes.DELETED
  );
  isArabic = inject(LangService).getCurrent().code === LangCodes.AR;
  currStatus: number = this.data.model.status;

  isActive(): boolean {
    return this.model.status === StatusTypes.ACTIVE;
  }

  toggleStatus(value: MatSlideToggleChange) {
    const { checked } = value;
    this.currStatus = checked ? 1 : 0;
  }

  _buildForm(): void {
    this.form = this.fb.group(this.model.buildForm(true));
  }

  protected _beforeSave(): boolean | Observable<boolean> {
    this.form.markAllAsTouched();
    return this.form.valid;
  }

  protected _prepareModel(): JobTitle | Observable<JobTitle> {
    this.model.status = this.currStatus;
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

  getJobTitleStatus(jobTitleStatus: number): { status: string; class: string } {
    const className: string =
      this.jobStatus.find((status) => status.lookupKey === jobTitleStatus)
        ?.enName || 'Activated';
    switch (this.lang.getCurrent().code) {
      case LangCodes.AR:
        return {
          status:
            this.jobStatus.find((status) => status.lookupKey === jobTitleStatus)
              ?.arName || 'فعالة',
          class: className,
        };
      case LangCodes.EN:
        return {
          status: className,
          class: className,
        };
      default:
        return {
          status: className,
          class: className,
        };
    }
  }
}
