import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CrudDialogDataContract } from '@contracts/crud-dialog-data-contract';
import { InternalUserOU } from '@models/internal-user-ou';
import { AdminDialogComponent } from '@abstracts/admin-dialog-component';
import { UntypedFormGroup } from '@angular/forms';
import { Observable, Subject, catchError, exhaustMap, filter, isObservable, map, of, switchMap, takeUntil, throwError } from 'rxjs';
import { OperationType } from '@enums/operation-type';
import { OrganizationUnit } from '@models/organization-unit';
import { OrganizationUnitService } from '@services/organization-unit.service';
import { InternalUserOUService } from '@services/internal-user-ou.service';
import { ignoreErrors } from '@utils/utils';

@Component({
  selector: 'app-internal-user-ou-popup',
  templateUrl: './internal-user-ou-popup.component.html',
  styleUrls: ['./internal-user-ou-popup.component.scss'],
})
export class InternalUserOUPopupComponent extends AdminDialogComponent<InternalUserOU> {
  saveBulk$: Subject<void> = new Subject<void>();
  form!: UntypedFormGroup;
  data: CrudDialogDataContract<InternalUserOU> = inject(MAT_DIALOG_DATA);
  service = inject(InternalUserOUService);
  organizationUnits!: OrganizationUnit[];
  organizationUnitService = inject(OrganizationUnitService);

  override _init(): void {
    this.listenToSaveBulk();
    this.organizationUnitService
      .loadAsLookups()
      .pipe(map(data => data.filter(ou => !(this.data.extras?.organizationUnits as number[]).includes(ou.id))))
      .subscribe(filteredData => {
        this.organizationUnits = filteredData;
      });
  }

  _buildForm(): void {
    this.form = this.fb.group(this.model.buildForm(true));
    this.internalUserId?.setValue(this.data.extras?.internalUserId);
  }

  protected _beforeSave(): boolean | Observable<boolean> {
    this.form.markAllAsTouched();
    return this.form.valid;
  }

  protected _prepareModel(): InternalUserOU | Observable<InternalUserOU> {
    return new InternalUserOU().clone<InternalUserOU>({
      ...this.model,
      ...this.form.value,
    });
  }

  protected _afterSave(): void {
    this.operation = OperationType.UPDATE;
    this.toast.success(this.lang.map.msg_save_x_success.change({ x: this.model.getNames() }));
    this.dialogRef.close(this.model);
  }
  get internalUserId() {
    return this.form.get('internalUserId');
  }
  get organizationUnitArray() {
    return this.form.get('organizationUnitArray');
  }

  createBulk(): Observable<InternalUserOU[]> {
    const payloadArr: any[] = [];
    this.organizationUnitArray?.value.forEach((value: number) => {
      payloadArr.push({ ...this.form.value, organizationUnitId: value });
    });
    return this.service.createBulkFull(payloadArr as unknown as InternalUserOU[]);
  }

  protected listenToSaveBulk() {
    this.saveBulk$
      .pipe(
        takeUntil(this.destroy$),
        switchMap(() => {
          const result = this._beforeSave();
          return isObservable(result) ? result : of(result);
        })
      )
      .pipe(filter(value => value))
      .pipe(
        switchMap(() => {
          const result = this._prepareModel();
          return isObservable(result) ? result : of(result);
        })
      )
      .pipe(
        exhaustMap(() => {
          return this.createBulk().pipe(
            catchError(error => {
              this._saveFail(error);
              return throwError(error);
            }),
            ignoreErrors()
          );
        })
      )
      .subscribe(() => {
        this._afterSave();
      });
  }
}
