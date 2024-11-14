import { Component, inject, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CrudDialogDataContract } from '@contracts/crud-dialog-data-contract';
import { CustomMenu } from '@models/custom-menu';
import { AdminDialogComponent } from '@abstracts/admin-dialog-component';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { OperationType } from '@enums/operation-type';
import { Lookup } from '@models/lookup';
import { LookupService } from '@services/lookup.service';
import { MenuItemContract } from '@contracts/menu-item-contract';
import { CustomValidators } from '@validators/custom-validators';
import { MenuItemService } from '@services/menu-item.service';
import { CustomMenuComponent } from '@modules/administration/components/custom-menu/custom-menu.component';
import { CustomMenuUrlHandlerComponent } from '@modules/administration/components/custom-menu-url-handler/custom-menu-url-handler.component';
import { StatusTypes } from '@enums/status-types';
import { CustomMenuService } from '@services/custom-menu.service';

@Component({
  selector: 'app-custom-menu-popup',
  templateUrl: './custom-menu-popup.component.html',
  styleUrls: ['./custom-menu-popup.component.scss'],
})
export class CustomMenuPopupComponent extends AdminDialogComponent<CustomMenu> {
  form!: UntypedFormGroup;
  data: CrudDialogDataContract<CustomMenu> = inject(MAT_DIALOG_DATA);
  saveVisible = true;
  lookupService = inject(LookupService);
  menuItemService = inject(MenuItemService);
  customMenuService = inject(CustomMenuService);
  menuTypes: Lookup[] = this.lookupService.lookups.menuType;
  userTypes: Lookup[] = this.lookupService.lookups.userType;
  menuViews: Lookup[] = this.lookupService.lookups.menuView;
  parentMenu?: CustomMenu;
  customMenus!: CustomMenu[];
  defaultParent?: MenuItemContract;
  defaultParents: MenuItemContract[] = [];
  selectedTabIndex$: Subject<number> = new Subject<number>();
  defaultSelectedTab: string = 'basic';
  validateFieldsVisible: boolean = true;
  selectedPopupTab = this.data.extras?.selectedPopupTab;
  @ViewChild('customMenuChildren') customMenuChildrenRef!: CustomMenuComponent;
  @ViewChild('urlHandlerComponent')
  urlHandlerComponentRef!: CustomMenuUrlHandlerComponent;

  override ngOnInit() {
    super.ngOnInit();
    this.loadCustomMenus();
  }

  loadCustomMenus() {
    this.customMenuService.loadAsLookups().subscribe(data => {
      this.customMenus = data.filter(data => data.isParentMenu());
    });
  }
  _buildForm(): void {
    this.form = this.fb.group(this.model.buildForm(true));
    if (this.isDefaultParent()) {
      this._addDefaultParents();
      this._updateDefaultParentValidity();
    }
  }

  protected _beforeSave(): boolean | Observable<boolean> {
    this.form.markAllAsTouched();
    this.urlHandlerComponentRef.form.markAllAsTouched();
    if (!this.form.valid) {
      this.selectedPopupTab = 0;
    } else if (
      !this.urlHandlerComponentRef.isValidUrl() ||
      !this.urlHandlerComponentRef.form.valid
    ) {
      this.selectedPopupTab = 1;
    }
    return this.form.valid && this.urlHandlerComponentRef.isValidUrl();
  }

  protected _prepareModel(): CustomMenu | Observable<CustomMenu> {
    const value = new CustomMenu().clone({
      ...this.model,
      ...this.form.getRawValue(),
    }) as CustomMenu;
    value.menuURL = this.urlHandlerComponentRef
      ? this.urlHandlerComponentRef.menuUrlControl.value
      : '';
    value.urlParamsParsed = this.urlHandlerComponentRef
      ? this.urlHandlerComponentRef.variableList
      : [];
    // if (this.defaultParent) {
    //   value.parentMenuItemId = -1;
    // }
    return value;
  }

  protected _afterSave(model: CustomMenu): void {
    this.model = model;
    this.operation = OperationType.UPDATE;
    this.toast.success(
      this.lang.map.msg_save_x_success.change({ x: this.model.getNames() }),
    );
    this.customMenuChildrenRef && this.customMenuChildrenRef.reload$.next();
    this.dialogRef.close(this.model);
  }

  private _updateDefaultParentValidity() {
    this.systemMenuKeyControl.setValidators([CustomValidators.required]);
    this.systemMenuKeyControl.updateValueAndValidity();
  }

  protected override _afterBuildForm() {
    super._afterBuildForm();
    this.handleDisableFields();

    if (this.readonly || this.isMainMenu()) {
      this.form.disable();
      this.saveVisible = false;
      this.validateFieldsVisible = false;
    }
  }

  isMainMenu() {
    return this.model.isDefaultItem();
  }

  handleDisableFields() {
    if (this.readonly) {
      this.form.disable();
      return;
    }
    if (!this.model?.isParentMenu()) {
      this._disableDependentFields();
    } else {
      if (!!this.model.id && (this.hasChildren || this.model.isSystem)) {
        this._disableDependentFields();
      } else {
        this._enableDependentFields();
      }
    }
  }

  get hasChildren(): boolean {
    if (!this.customMenuChildrenRef) {
      return false;
    }
    return this.customMenuChildrenRef.dataSource.data.length > 0;
  }

  get readonly(): boolean {
    return this.operation === OperationType.VIEW;
  }

  private _disableDependentFields() {
    this.childrenDependentFields.forEach(field => field.disable());
  }

  private _enableDependentFields() {
    this.childrenDependentFields.forEach(field => field.enable());
  }

  get childrenDependentFields(): UntypedFormControl[] {
    const fields: UntypedFormControl[] = [];
    if (this.parentMenu?.isSystem) {
      return fields;
    }

    return fields.concat([this.menuTypeControl, this.menuViewControl]);
  }

  get menuViewControl(): UntypedFormControl {
    return this.form.get('menuView') as UntypedFormControl;
  }

  get menuTypeControl(): UntypedFormControl {
    return this.form.get('menuType') as UntypedFormControl;
  }

  get userTypeControl(): UntypedFormControl {
    return this.form.get('userType') as UntypedFormControl;
  }

  get systemMenuKeyControl(): UntypedFormControl {
    return this.form.get('systemMenuKey') as UntypedFormControl;
  }

  getTranslatedMenuView() {
    return this.menuViewControl.value
      ? this.lang.map.private_menu
      : this.lang.map.public_menu;
  }

  private _addDefaultParents() {
    this.defaultParents = this.menuItemService.parents
      .filter(x => !x.customMenu && !x.excludeFromDefaultParents)
      .sort((a, b) => a.defaultId! - b.defaultId!);
  }

  isDefaultParent() {
    return this.parentMenu && this.parentMenu.isDefaultItem();
  }

  protected readonly StatusTypes = StatusTypes;

  showCustomMenu() {
    return (
      !this.inCreateMode() && this.model.id && !this.model.parentMenuItemId
    );
  }

  changeMenuView() {
    if (this.inViewMode()) return;
    this.menuViewControl.value === 1
      ? this.menuViewControl.setValue(null)
      : this.menuViewControl.setValue(1);
  }
}
