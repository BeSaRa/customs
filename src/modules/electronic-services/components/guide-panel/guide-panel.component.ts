import { Component, OnInit, inject } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { OffenderTypes } from '@enums/offender-types';
import { OnDestroyMixin } from '@mixins/on-destroy-mixin';
import { GuidePanel } from '@models/guide-panel';
import { Lookup } from '@models/lookup';
import { ViolationType } from '@models/violation-type';
import { GuidePanelService } from '@services/guide-panel.service';
import { LangService } from '@services/lang.service';
import { LookupService } from '@services/lookup.service';
import { ViolationTypeService } from '@services/violation-type.service';
import { ignoreErrors } from '@utils/utils';
import { CustomValidators } from '@validators/custom-validators';
import { Observable, Subject, catchError, exhaustMap, filter, isObservable, of, switchMap, takeUntil, throwError } from 'rxjs';

@Component({
  selector: 'app-guide-panel',
  templateUrl: './guide-panel.component.html',
  styleUrls: ['./guide-panel.component.scss'],
})
export class GuidePanelComponent extends OnDestroyMixin(class {}) implements OnInit {
  guidePanelService = inject(GuidePanelService);
  lookupService = inject(LookupService);
  lang = inject(LangService);
  fb = inject(UntypedFormBuilder);
  violationTypeService = inject(ViolationTypeService);

  offenderTypes: Lookup[] = this.lookupService.lookups.offenderType;
  offenderLevels: Lookup[] = this.lookupService.lookups.offenderLevel;
  penaltySigners: Lookup[] = this.lookupService.lookups.penaltySigner;
  violationTypes!: ViolationType[];

  form!: UntypedFormGroup;
  search$: Subject<void> = new Subject();

  ngOnInit(): void {
    this.getViolationTypes();
    this.form = this.fb.group(new GuidePanel().buildForm());
    this.onOffenderTypeChange();
    this.listenToSearch();
  }
  protected _beforeSearch(): boolean | Observable<boolean> {
    this.form.markAllAsTouched();
    return this.form.valid;
  }

  get offenderTypeField() {
    return this.form.get('offenderType');
  }
  get offenderLevelField() {
    return this.form.get('offenderLevel');
  }
  resetForm() {
    this.form.reset();
  }
  protected getViolationTypes() {
    this.violationTypeService.loadAsLookups().subscribe(data => {
      this.violationTypes = data;
    });
  }
  isEmployee() {
    return this.offenderTypeField?.value === OffenderTypes.EMPLOYEE;
  }
  onOffenderTypeChange() {
    this.offenderTypeField?.valueChanges.subscribe(value => {
      if (value === OffenderTypes.EMPLOYEE) {
        this.offenderLevelField?.setValidators(CustomValidators.required);
      } else {
        this.offenderLevelField?.setValue(null);
        this.offenderLevelField?.setValidators(null);
      }
      this.offenderLevelField?.updateValueAndValidity();
    });
  }
  private listenToSearch() {
    this.search$
      .pipe(
        takeUntil(this.destroy$),
        switchMap(() => {
          const result = this._beforeSearch();
          return isObservable(result) ? result : of(result);
        })
      )
      .pipe(filter(value => value))
      .pipe(
        exhaustMap(() => {
          return this.guidePanelService.loadSearchResult(this.formValidValues()).pipe(
            catchError(error => {
              return throwError(error);
            }),
            ignoreErrors()
          );
        })
      )
      .subscribe(result => {
        console.log(result);
      });
  }
  formValidValues() {
    let values = this.form.value;

    if (values.offenderLevel === null) {
      delete values.offenderLevel;
    }
    if (values.repeat === null) {
      delete values.repeat;
    }
    return values;
  }
}
