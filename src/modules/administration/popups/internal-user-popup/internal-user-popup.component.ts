import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CrudDialogDataContract } from '@contracts/crud-dialog-data-contract';
import { InternalUser } from '@models/internal-user';
import { AdminDialogComponent } from '@abstracts/admin-dialog-component';
import { UntypedFormGroup } from '@angular/forms';
import { catchError, filter, Observable, of } from 'rxjs';
import { OperationType } from '@enums/operation-type';
import { Lookup } from '@models/lookup';
import { LookupService } from '@services/lookup.service';
import { PermissionService } from '@services/permission.service';
import { AppIcons } from '@constants/app-icons';
import { InternalUserService } from '@services/internal-user.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { UserSignature } from '@models/user-signature';

@Component({
  selector: 'app-internal-user-popup',
  templateUrl: './internal-user-popup.component.html',
  styleUrls: ['./internal-user-popup.component.scss'],
})
export class InternalUserPopupComponent extends AdminDialogComponent<InternalUser> {
  form!: UntypedFormGroup;
  data: CrudDialogDataContract<InternalUser> = inject(MAT_DIALOG_DATA);
  private readonly lookupService = inject(LookupService);
  private readonly permissionService = inject(PermissionService);
  private readonly internalUserService = inject(InternalUserService);
  private readonly sanitizer = inject(DomSanitizer);
  signatureSafeUrl: SafeResourceUrl | null = null;
  userSignature!: UserSignature;
  statusList!: Lookup[];

  protected readonly AppIcons = AppIcons;

  _buildForm(): void {
    this.form = this.fb.group({
      ...this.model.buildForm(true),
      userPreferences: this.fb.group(this.model.buildUserPreferencesForm(true)),
    });
  }

  protected _beforeSave(): boolean | Observable<boolean> {
    this.form.markAllAsTouched();
    return this.form.valid;
  }

  protected _prepareModel(): InternalUser | Observable<InternalUser> {
    return new InternalUser().clone<InternalUser>({
      ...this.model,
      ...this.form.value,
    });
  }

  protected _afterSave(model: InternalUser): void {
    this.model = model;
    this.operation = OperationType.UPDATE;
    this.toast.success(
      this.lang.map.msg_save_x_success.change({ x: this.model.getNames() }),
    );
    this.internalUserService
      .uploadSignature(this.userSignature)
      .pipe(
        catchError(() => of(null)),
        filter(response => response !== null),
      )
      .subscribe();
    // you can close the dialog after save here
    this.dialogRef.close(this.model);
  }

  protected override _init(): void {
    this.statusList = this.lookupService.lookups.commonStatus;
    this.getSignatureSafeURL();
  }

  private getSignatureSafeURL() {
    if (this.inCreateMode()) return;
    this.internalUserService
      .downloadSignature(this.model.id, this.sanitizer)
      .subscribe(blob => {
        if (blob.blob.size !== 0) this.signatureSafeUrl = blob.safeUrl;
      });
  }

  filesDropped($event: DragEvent) {
    $event.preventDefault();
    if (!$event.dataTransfer) return;
    if (!$event.dataTransfer.files) return;
    if (!$event.dataTransfer.files[0]) return;
    this.userSignature = new UserSignature(
      this.data.model.id,
      $event.dataTransfer.files[0],
    );
    const reader = new FileReader();
    reader.onload = e => {
      const blob = new Blob([e.target!.result!]);
      const url = window.URL.createObjectURL(blob);
      this.signatureSafeUrl =
        this.sanitizer.bypassSecurityTrustResourceUrl(url);
    };
    reader.readAsArrayBuffer(this.userSignature.content as File);
  }

  getSignatureStyle(): string {
    if (this.inEditMode())
      return 'border-dashed border-primary/20 rounded border-4 w-full flex items-center justify-center h-96 bg-gray-200';
    if (this.inViewMode())
      return 'rounded w-full flex items-center justify-center h-96';
    return '';
  }
}
