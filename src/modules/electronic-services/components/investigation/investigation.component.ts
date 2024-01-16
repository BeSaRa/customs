import { DialogService } from '@services/dialog.service';
import { WitnessesListComponent } from '@standalone/components/witnesses-list/witnesses-list.component';
import { Component, inject, ViewChild } from '@angular/core';
import { LangService } from '@services/lang.service';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { InvestigationService } from '@services/investigation.service';
import { Investigation } from '@models/investigation';
import { BaseCaseComponent } from '@abstracts/base-case-component';
import { SaveTypes } from '@enums/save-types';
import { OperationType } from '@enums/operation-type';
import { Subject, Observable, of } from 'rxjs';
import { filter, map, take, takeUntil, switchMap, tap } from 'rxjs/operators';
import { CaseFolder } from '@models/case-folder';
import { DateAdapter } from '@angular/material/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { Violation } from '@models/violation';
import { OffenderListComponent } from '@standalone/components/offender-list/offender-list.component';
import { TransformerAction } from '@contracts/transformer-action';
import { ViolationListComponent } from '@standalone/components/violation-list/violation-list.component';
import { ToastService } from '@services/toast.service';
import { OpenFrom } from '@enums/open-from';
import { INavigatedItem } from '@contracts/inavigated-item';
import { EncryptionService } from '@services/encryption.service';
import { EmployeeService } from '@services/employee.service';
import { LookupService } from '@services/lookup.service';
import { SendTypes } from '@enums/send-types';
import { CommonCaseStatus } from '@enums/common-case-status';
import { Offender } from '@models/offender';

@Component({
  selector: 'app-investigation',
  templateUrl: './investigation.component.html',
  styleUrls: ['./investigation.component.scss'],
})
export class InvestigationComponent extends BaseCaseComponent<Investigation, InvestigationService> {
  lang = inject(LangService);
  route = inject(ActivatedRoute);
  fb = inject(UntypedFormBuilder);
  dialog = inject(DialogService);
  form!: UntypedFormGroup;
  service = inject(InvestigationService);
  employeeService = inject(EmployeeService);
  router = inject(Router);
  activeRoute = inject(ActivatedRoute);
  location = inject(Location);
  toast = inject(ToastService);
  encrypt = inject(EncryptionService);
  lookupService = inject(LookupService);
  @ViewChild(ViolationListComponent) violationListComponent!: ViolationListComponent;
  @ViewChild(OffenderListComponent) offenderListComponent!: OffenderListComponent;
  @ViewChild(WitnessesListComponent) witnessestListComponent!: WitnessesListComponent;
  violationDegreeConfidentiality = this.lookupService.lookups.violationDegreeConfidentiality;
  caseFolders: CaseFolder[] = [];
  caseFoldersMap?: Record<string, CaseFolder>;

  adapter = inject(DateAdapter);
  selectedTab = 0;

  tabsArray = ['basic_info', 'offenders', 'violations', 'external_persons'];
  violations: Violation[] = [];
  offenders: Offender[] = [];

  protected override _init() {
    super._init();
  }

  isHrManager() {
    return this.employeeService.isHrManager();
  }
  summaryMode() {
    return (this.openFrom === OpenFrom.ADD_SCREEN || !this.openFrom) && !this.canEdit();
  }
  canEdit() {
    return (
      this.model?.getCaseStatus() == CommonCaseStatus.NEW ||
      this.model?.getCaseStatus() == CommonCaseStatus.DRAFT ||
      this.model?.getCaseStatus() == CommonCaseStatus.RETURNED
    );
  }
  _buildForm(): void {
    this.form = this.fb.group(this.model ? this.model.buildForm(true, this.readonly) : new Investigation().buildForm(true, this.readonly));
    this.listenToLocationChange();
  }
  canViewExternalPersonsTab() {
    return this.employeeService.hasPermissionTo('VIEW_WITNESS');
  }
  _afterBuildForm(): void {
    this.loadCaseFolders();
  }

  _beforeSave(saveType: SaveTypes): boolean | Observable<boolean> {
    (!this.violations.length && !this.offenders.length)
      && this.dialog.error(this.lang.map.add_violation_or_offender_first_to_take_this_action);
    return !!this.violations.length || !!this.offenders.length;
  }

  _prepareModel(): Investigation | Observable<Investigation> {
    return new Investigation().clone<Investigation>({
      ...this.model,
      ...this.form.getRawValue(),
    });
  }

  _afterSave(model: Investigation, saveType: SaveTypes, operation: OperationType): void {
    this.model = model;
    // display success message based on operation and save type

    this.loadCaseFolders();
  }
  _beforeLaunch(): boolean | Observable<boolean> {
    return true;
  }
  _afterLaunch(): void {
    this.resetForm();
    this.toast.success(this.lang.map.request_has_been_sent_successfully);
  }
  managerLaunch() {
    // TODO: add maager launch logic
  }
  _updateForm(model: Investigation): void {
    this.handleReadOnly();
    if (!model.id) this.resetForm();
    this.model = model;
    this.form.patchValue(model.buildForm(false, this.readonly));
  }
  handleReadOnly() {
    if (!this.model?.id) {
      return;
    }
    // let caseStatus = this.model.getCaseStatus();
    if (this.openFrom === OpenFrom.USER_INBOX) {
    } else if (this.openFrom === OpenFrom.TEAM_INBOX) {
      if (this.model.isClaimed()) {
        this.readonly = false;
      }
    } else if (this.openFrom === OpenFrom.SEARCH) {
      // if saved as draft, then no readonly
      if (this.model?.canCommit()) {
        this.readonly = false;
      }
    }
  }
  saveCase(e: Subject<TransformerAction<Investigation>>) {
    of(new Investigation().clone<Investigation>(this.form.value))
      .pipe(
        tap(_ => {
          this.form.invalid && this.dialog.error(this.lang.map.msg_make_sure_all_required_fields_are_filled);
        }),
        filter(_ => this.form.valid),
        switchMap(model => {
          return model.save();
        })
      )
      .subscribe((model: Investigation) => {
        this.router.navigate([], {
          relativeTo: this.activeRoute,
          queryParams: {
            ...this.activeRoute.snapshot.queryParams,
            item: this.encrypt.encrypt<INavigatedItem>({
              openFrom: OpenFrom.ADD_SCREEN,
              taskId: model.id,
              caseId: model.id,
              caseType: model.caseType,
            }),
          },
        });
        e.next({
          action: 'done',
          model,
        });
        this._updateForm(model);
      });
  }
  loadCaseFolders(): void {
    if (!this.model) return;
    // if there is no folders load it
    if (!this.caseFolders.length && this.model.id) {
      this.model
        .getService()
        .loadCaseFolders(this.model.id)
        .pipe(map(folders => (this.caseFolders = folders)))
        .subscribe(folders => {
          this.caseFoldersMap = folders.reduce((acc, item) => {
            return { ...acc, [item.name.toLowerCase()]: item };
          }, {} as Record<string, CaseFolder>);
        });
    }
  }

  getCaseFolderIdByName(name: string): string | undefined {
    return this.caseFoldersMap && this.caseFoldersMap[name.toLowerCase()].id;
  }
  launchCase(type: SendTypes) {
    if (!this.model) return;
    this.model.applicantDecision = type;
    this.model
      .save()
      .pipe(
        switchMap(() => {
          return this.launch();
        })
      )
      .subscribe();
  }

  tabChange($event: number) {
    const selectedTab = this.tabsArray[$event];
    // console.log(location);
    this.router
      .navigate([], {
        relativeTo: this.activeRoute,
        queryParams: { ...this.activeRoute.snapshot.queryParams, tab: selectedTab },
      })
      .then();
  }
  resetForm() {
    this.form.reset();
    this.violationListComponent.resetDataList();
    this.offenderListComponent.resetDataList();
    this.witnessestListComponent.resetDataList();
    this.tabChange(0);
    this.router.navigate([], {
      relativeTo: this.activeRoute,
      queryParams: {},
    });
  }
  private listenToLocationChange() {
    this.activeRoute.queryParams
      .pipe(takeUntil(this.destroy$))
      .pipe(take(1))
      .pipe(filter(value => !!value['tab']))
      .pipe(map(val => this.tabsArray.indexOf(val['tab'] as string)))
      .subscribe(index => {
        this.selectedTab = index === -1 ? 1 : index;
      });
  }
  resetOffendersAndExternalPersons() {
    this.offenderListComponent.deleteAllOffender();
    this.witnessestListComponent.deleteAllWitnesses();
  }
}
