import { OrganizationUnitService } from '@services/organization-unit.service';
import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CrudDialogDataContract } from '@contracts/crud-dialog-data-contract';
import { OrganizationUnit } from '@models/organization-unit';
import { AdminDialogComponent } from '@abstracts/admin-dialog-component';
import { UntypedFormGroup } from '@angular/forms';
import { Observable, catchError, filter, of } from 'rxjs';
import { OperationType } from '@enums/operation-type';
import { Lookup } from '@models/lookup';
import { LookupService } from '@services/lookup.service';
import { InternalUserService } from '@services/internal-user.service';
import { InternalUser } from '@models/internal-user';
import { OuLogo } from '@models/ou_logo';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { AppIcons } from '@constants/app-icons';
import { OrganizationUnitType } from '@enums/organization-unit-type';
import { MawaredDepartmentService } from '@services/mawared-department.service';
import { DialogService } from '@services/dialog.service';
import { MawaredDepartment } from '@models/mawared-department';
import { MawaredDepartmentResultPopupComponent } from '@modules/administration/popups/mawared-department-result-popup/mawared-department-result-popup.component';

@Component({
  selector: 'app-organization-unit-popup',
  templateUrl: './organization-unit-popup.component.html',
  styleUrls: ['./organization-unit-popup.component.scss'],
})
export class OrganizationUnitPopupComponent extends AdminDialogComponent<OrganizationUnit> {
  form!: UntypedFormGroup;
  data: CrudDialogDataContract<OrganizationUnit> = inject(MAT_DIALOG_DATA);
  ouLogo!: OuLogo;
  ouLogoSafeUrl: SafeResourceUrl | null = null;

  unitTypes: Lookup[] = inject(
    LookupService,
  ).lookups.organizationUnitType.filter(
    ou =>
      ou.lookupKey !== OrganizationUnitType.OFFICE &&
      ou.lookupKey !== OrganizationUnitType.COMMITTEE,
  );
  internalUserService = inject(InternalUserService);
  private readonly sanitizer = inject(DomSanitizer);
  private readonly mawaredDepartmentService = inject(MawaredDepartmentService);
  private readonly dialog = inject(DialogService);
  internalUsers!: InternalUser[];
  organizationUnitService = inject(OrganizationUnitService);
  organizationUnits!: OrganizationUnit[];
  assistantOus!: OrganizationUnit[];
  managerAssistants!: InternalUser[];

  protected readonly AppIcons = AppIcons;

  protected override _initPopup(): void {
    super._initPopup();
    this.getInternalUsers();
    this.getOrganizationUnits();
    this.loadAssistantOus();
    this.loadManagerAssistants(this.model.id);
    this.getouLogoSafeURL();
  }

  _buildForm(): void {
    this.form = this.fb.group(this.model.buildForm(true));
  }

  protected _beforeSave(): boolean | Observable<boolean> {
    this.form.markAllAsTouched();
    return this.form.valid;
  }

  protected _prepareModel(): OrganizationUnit | Observable<OrganizationUnit> {
    return new OrganizationUnit().clone<OrganizationUnit>({
      ...this.model,
      ...this.form.value,
    });
  }

  protected _afterSave(model: OrganizationUnit): void {
    this.model = model;
    this.operation = OperationType.UPDATE;
    this.toast.success(
      this.lang.map.msg_save_x_success.change({ x: this.model.getNames() }),
    );
    this.organizationUnitService
      .uploadOuLogo(this.ouLogo)
      .pipe(
        catchError(() => of(null)),
        filter(response => response !== null),
      )
      .subscribe();
    // you can close the dialog after save here
    this.dialogRef.close(this.model);
  }

  protected getInternalUsers() {
    this.internalUserService.loadAsLookups().subscribe(data => {
      this.internalUsers = data;
    });
  }

  protected getOrganizationUnits() {
    this.organizationUnitService.loadAsLookups().subscribe(data => {
      this.organizationUnits = data;
    });
  }

  protected loadAssistantOus() {
    this.organizationUnitService
      .loadOUsByType(OrganizationUnitType.ASSISTANT_DEPARTMENT)
      .subscribe(ous => (this.assistantOus = ous));
  }

  protected loadManagerAssistants(ouId: number) {
    if (ouId)
      this.internalUserService
        .getInternalUsersByOuId(ouId)
        .subscribe(internalUsers => {
          this.managerAssistants = internalUsers;
        });
  }

  filesDropped($event: DragEvent) {
    $event.preventDefault();
    if (!$event.dataTransfer) return;
    if (!$event.dataTransfer.files) return;
    if (!$event.dataTransfer.files[0]) return;
    this.ouLogo = new OuLogo(this.data.model.id, $event.dataTransfer.files[0]);
    const reader = new FileReader();
    reader.onload = e => {
      const blob = new Blob([e.target!.result!]);
      const url = window.URL.createObjectURL(blob);
      this.ouLogoSafeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
    };
    if (this.ouLogo && this.ouLogo.content !== undefined) {
      reader.readAsArrayBuffer(this.ouLogo?.content as File);
    }
  }

  getOuLogoStyle(): string {
    if (this.inEditMode())
      return 'border-dashed border-primary/20 rounded border-4 w-full flex items-center justify-center h-96 bg-gray-200';
    if (this.inViewMode())
      return 'rounded w-full flex items-center justify-center h-96';
    return '';
  }

  getouLogoSafeURL() {
    if (this.inCreateMode()) return;
    this.organizationUnitService
      .downloadOuLogo(this.model.id, this.sanitizer)
      .subscribe(blob => {
        if (blob.blob.size !== 0) this.ouLogoSafeUrl = blob.safeUrl;
      });
  }

  get mawaredDepIdCtrl() {
    return this.form.get('mawaredDepId');
  }

  autoFillFields() {
    this.mawaredDepartmentService.loadAsLookups().subscribe(departments => {
      const res = departments.filter(dep => {
        return dep?.departmentId
          .toString()
          .includes(this.mawaredDepIdCtrl?.value);
      });
      if (!res.length) {
        this.dialog.warning(
          this.lang.map.no_mawared_department_with_this_department_id,
        );
      } else if (res.length === 1) {
        this.setDepartment(res[0]);
      } else {
        this.dialog
          .open(MawaredDepartmentResultPopupComponent, {
            data: { mawaredDepartments: res },
          })
          .afterClosed()
          .subscribe(res => {
            if (res) {
              this.setDepartment(res as unknown as MawaredDepartment);
            }
          });
      }
    });
  }

  setDepartment(department: MawaredDepartment) {
    const { arName, enName, status, departmentId, ldapCode, parentId } =
      department;
    this.form.patchValue({
      arName,
      enName,
      status,
      ldapGroupName: ldapCode,
      mawaredDepId: departmentId,
      parent: parentId,
    });
  }
}
