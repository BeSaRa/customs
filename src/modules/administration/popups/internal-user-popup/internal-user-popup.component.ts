import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CrudDialogDataContract } from '@contracts/crud-dialog-data-contract';
import { InternalUser } from '@models/internal-user';
import { AdminDialogComponent } from '@abstracts/admin-dialog-component';
import { UntypedFormGroup } from '@angular/forms';
import { Observable, of, takeUntil, withLatestFrom } from 'rxjs';
import { OperationType } from '@enums/operation-type';
import { Lookup } from '@models/lookup';
import { LookupService } from '@services/lookup.service';
import { PermissionService } from '@services/permission.service';
import { Permission } from '@models/permission';
import { TabMap } from '@constants/tab-map-type';

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
  statusList!:Lookup[]
  permissions!:Permission[]


  _buildForm(): void {
    this.form = this.fb.group({
      ...this.model.buildForm(true), 
      userPreferences: this.fb.group(this.model.buildUserPreferencesForm(true)),
      userPermissions: this.fb.group({
        permissions: [false],
        customRoleId: [this.model?.customRoleId]
      })
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
      this.lang.map.msg_save_x_success.change({ x: this.model.getNames() })
    );
    // you can close the dialog after save here 
    this.dialogRef.close(this.model);
  }
  tabsData:TabMap = {
    basic: {
      name: 'basic',
      langKey: 'lbl_basic_info',
      index: 0,
      // checkTouchedDirty: true,
      validStatus: () => {
        if (!this.form || !this.inViewMode) {
          return true;
        }
        return this.form.valid;
      },
      isTouchedOrDirty: () => {
        if (!this.form) {
          return true;
        }
        return this.form!.touched || this.form!.dirty;
      }
    },
    userPreferences: {
      name: 'userPreferences',
      langKey: 'lbl_user_preferences',
      index: 1,
      validStatus: () => {
        if (!this.userPreferences || !this.inViewMode) {
          return true;
        }
        return this.userPreferences.valid;
      },
      isTouchedOrDirty: () => {
        if (!this.userPreferences) {
          return true;
        }
        return this.userPreferences!.touched || this.userPreferences!.dirty;
      }
    },
    permissions: {
      name: 'permissions',
      langKey: 'lbl_permissions',
      index: 1,
      validStatus: () => {
        if (!this.permissionsFormTab || !this.inViewMode) {
          return true;
        }
        return this.permissionsFormTab.valid;
      },
      isTouchedOrDirty: () => {
        if (!this.permissionsFormTab) {
          return true;
        }
        return this.permissionsFormTab.touched || this.permissionsFormTab.dirty;
      }
    },
  };
  
  protected override _init(): void {
    this.statusList = this.lookupService.lookups.commonStatus   
    this.loadPermissions() 
  }
  
  getTabInvalidStatus(tabName: string): boolean {
    let tab = this.tabsData[tabName];
    if (!tab) {
      console.info('tab not found: %s', tabName);
      return true; // if tab not found, consider it invalid
    }
    if (!tab.checkTouchedDirty) {
      return !tab.validStatus();
    }
    return !tab.validStatus() && tab.isTouchedOrDirty();
  }

  get permissionsFormTab() {
    return this.form.get('userPermissions');
  }

  get customRoleId() {
    return this.permissionsFormTab?.get('customRoleId');
  }

  get userPermissions() {
    return this.permissionsFormTab?.get('permissions');
  }

  get userPreferences(){
    return this.form.get('userPreferences')
  }

  get customRoleIdField(){
    return this.form.get('customRoleId')
  }

  private loadPermissions() {
    this.permissionService
      .loadAsLookups()
      .pipe(takeUntil(this.destroy$))
      .pipe(withLatestFrom(of(this.lookupService.lookups.permissionCategory)))
      .subscribe((userPermissions) => {        
        this.permissions = userPermissions[0]
      });

  }
}
