import { Component, OnInit, inject } from '@angular/core';
import { GlobalSetting } from '@models/global-setting';
import { GlobalSettingService } from '@services/global-setting.service';
import { FormArray, FormControl, FormGroup, UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import {
  BehaviorSubject,
  Observable,
  switchMap,
  takeUntil,
  Subject,
  isObservable,
  of,
  filter,
  exhaustMap,
  catchError,
  throwError,
  finalize,
  tap,
} from 'rxjs';
import { CustomValidators } from '@validators/custom-validators';
import { FileType } from '@models/file-type';
import { FileTypeService } from '@services/file-type.service';
import { LangService } from '@services/lang.service';
import { ToastService } from '@services/toast.service';
import { OnDestroyMixin } from '@mixins/on-destroy-mixin';
import { ignoreErrors } from '@utils/utils';

@Component({
  selector: 'app-global-setting',
  templateUrl: './global-setting.component.html',
  styleUrls: ['./global-setting.component.scss'],
})
export class GlobalSettingComponent extends OnDestroyMixin(class {}) implements OnInit {
  model!: GlobalSetting;
  globalSettingForm!: UntypedFormGroup;
  form!: UntypedFormGroup;
  lang = inject(LangService);
  fb = inject(UntypedFormBuilder);
  save$: Subject<void> = new Subject<void>();
  toast = inject(ToastService);

  ngOnInit(): void {
    this._initForm();

    // this._afterBuildForm();
    this._listenToSave();
  }
  protected _initForm(): void {
    this.form = new FormGroup({
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
    this.getFileTypes();
    this._getGlobalSettings();
  }
  _buildForm(): void {
    this.form = this.fb.group({
      ...this.model.buildForm(true),
      supportEmailListParsed: this.fb.array([['', CustomValidators.required]]),
    });
    this.supportEmailListParsed.removeAt(0);
    this.model.supportEmailListParsed.forEach(element => {
      this.supportEmailListParsed.push(new FormControl(element, CustomValidators.required));
    });
  }
  resetForm() {
    this._getGlobalSettings();
  }
  protected _listenToSave() {
    this.save$
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
        exhaustMap(model => {
          return model.save().pipe(
            catchError(error => {
              this._saveFail(error);
              return throwError(error);
            }),
            ignoreErrors()
          );
        })
      )
      .subscribe(model => {
        this._afterSave(model);
      });
  }
  protected _beforeSave(): boolean | Observable<boolean> {
    this.form.markAllAsTouched();
    return this.form.valid;
  }
  protected _prepareModel(): GlobalSetting | Observable<GlobalSetting> {
    return new GlobalSetting().clone<GlobalSetting>({
      ...this.model,
      ...this.form.value,
    });
  }
  protected _saveFail(error: unknown) {
    console.log(error);
  }
  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSubject.asObservable();

  service = inject(GlobalSettingService);
  globalSettings!: GlobalSetting;

  fileTypeService = inject(FileTypeService);

  fileTypes!: FileType[];

  _getGlobalSettings() {
    return this.service
      .loadById(10)
      .pipe(
        finalize(() => this.loadingSubject.next(false)),
        ignoreErrors(),
        tap(() => {
          this.loadingSubject.next(false);
        })
      )
      .subscribe(data => {
        this.supportEmailListParsed.removeAt(0);
        data.supportEmailListParsed.forEach(element => {
          this.supportEmailListParsed.push(new FormControl({ value: element, disabled: true }, CustomValidators.required));
        });
        this.form.patchValue(data);
        this.globalSettings = data;
        this.model = data;
        this._buildForm();
        this.loadingSubject.next(true);
      });
  }
  get supportEmailListParsed() {
    return this.form.controls['supportEmailListParsed'] as FormArray;
  }

  protected getFileTypes() {
    this.fileTypeService.load().subscribe(data => {
      this.fileTypes = data.rs;
    });
  }

  protected _afterSave(model: GlobalSetting): void {
    this.toast.success(this.lang.map.msg_save_x_success.change({ x: this.getApplicationName() }));
  }

  addEmail() {
    this.supportEmailListParsed.push(new FormControl('', [CustomValidators.required, CustomValidators.pattern('EMAIL')]));
  }

  deleteEmail(emailIndex: number) {
    this.supportEmailListParsed.removeAt(emailIndex);
  }

  getApplicationName(): string {
    return this.lang.getCurrent().code === 'ar' ? this.globalSettings.systemArabicName : this.globalSettings.systemEnglishName;
  }
}
