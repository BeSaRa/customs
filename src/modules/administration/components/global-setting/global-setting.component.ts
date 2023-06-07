import { Component, inject } from '@angular/core';
import { AdminComponent } from '@abstracts/admin-component';
import { GlobalSetting } from '@models/global-setting';
import { GlobalSettingService } from '@services/global-setting.service';
import { GlobalSettingPopupComponent } from '@modules/administration/popups/global-setting-popup/global-setting-popup.component';
import { ContextMenuActionContract } from '@contracts/context-menu-action-contract';
import { AppIcons } from '@constants/app-icons';
import { ColumnsWrapper } from '@models/columns-wrapper';
import { TextFilterColumn } from '@models/text-filter-column';
import { NoneFilterColumn } from '@models/none-filter-column';
import { FormArray, FormControl, FormGroup, UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { switchMap, takeUntil } from 'rxjs';
import { CustomValidators } from '@validators/custom-validators';
import { FileType } from '@models/file-type';
import { FileTypeService } from '@services/file-type.service';

@Component({
  selector: 'app-global-setting',
  templateUrl: './global-setting.component.html',
  styleUrls: ['./global-setting.component.scss'],
})
export class GlobalSettingComponent extends AdminComponent<GlobalSettingPopupComponent, GlobalSetting, GlobalSettingService> {
  service = inject(GlobalSettingService);
  globalSettings!: GlobalSetting;
  form = new FormGroup({
    systemArabicName: new FormControl('', [CustomValidators.required, CustomValidators.maxLength(50), CustomValidators.pattern('AR_ONLY')]),
    systemEnglishName: new FormControl('', [CustomValidators.required, CustomValidators.maxLength(50), CustomValidators.pattern('ENG_ONLY')]),
    sessionTimeout: new FormControl(0, [CustomValidators.required, CustomValidators.number]),
    fileSize: new FormControl(0, [CustomValidators.required, CustomValidators.number]),
    fileTypeParsed: new FormControl([''], CustomValidators.required),
    inboxRefreshInterval: new FormControl(0, CustomValidators.required),
    supportEmailListParsed: new FormArray([new FormControl('', CustomValidators.required)]),
    enableMailNotification: new FormControl(true, CustomValidators.required),
    enableSMSNotification: new FormControl(true, CustomValidators.required),
    maxDeductionRatio: new FormControl(0, CustomValidators.required),
  });
  fileTypeService = inject(FileTypeService);

  fileTypes!: FileType[];

  override ngOnInit(): void {
    super.ngOnInit();
    this.getFileTypes();
    this.form.disable();
    this.supportEmailListParsed.disable();

    this._getGlobalSettings();
    // this.service.loadById(10).subscribe(val => {
    //   console.log(val);
    //   this.globalSettings = val;
    //   this.form = this.globalSettings.buildForm(true) as FormGroup;
    // });
  }
  _getGlobalSettings() {
    this.data$
      .pipe(takeUntil(this.destroy$))
      .pipe(model => {
        return this.service.loadById(10);
      })
      .subscribe(data => {
        this.supportEmailListParsed.removeAt(0);
        data.supportEmailListParsed.forEach(element => {
          this.supportEmailListParsed.push(new FormControl({ value: element, disabled: true }, CustomValidators.required));
        });
        this.form.patchValue(data);
        this.globalSettings = data;
      });
    // .subscribe(() => this.reload$.next());
  }
  get supportEmailListParsed() {
    return this.form.controls['supportEmailListParsed'] as FormArray;
  }

  protected getFileTypes() {
    this.fileTypeService.load().subscribe(data => {
      this.fileTypes = data.rs;
    });
  }

  actions: ContextMenuActionContract<GlobalSetting>[] = [
    {
      name: 'view',
      type: 'action',
      label: 'view',
      icon: AppIcons.VIEW,
      callback: item => {
        this.view$.next(item);
      },
    },
    {
      name: 'edit',
      type: 'action',
      label: 'edit',
      icon: AppIcons.EDIT,
      callback: item => {
        this.edit$.next(item);
      },
    },
    {
      name: 'delete',
      type: 'action',
      label: 'delete',
      icon: AppIcons.DELETE,
      callback: item => {
        this.delete$.next(item);
      },
    },
  ];
  // here we have a new implementation for displayed/filter Columns for the table
  columnsWrapper: ColumnsWrapper<GlobalSetting> = new ColumnsWrapper(
    new NoneFilterColumn('select'),
    new TextFilterColumn('arName'),
    new NoneFilterColumn('actions')
  ).attacheFilter(this.filter$);
}
