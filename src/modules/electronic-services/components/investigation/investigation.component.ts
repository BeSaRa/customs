import { DialogService } from '@services/dialog.service';
import { WitnessesListComponent } from '@standalone/components/witnesses-list/witnesses-list.component';
import {
  AfterViewInit,
  Component,
  computed,
  inject,
  input,
  signal,
  ViewChild,
} from '@angular/core';
import { LangService } from '@services/lang.service';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { InvestigationService } from '@services/investigation.service';
import { Investigation } from '@models/investigation';
import { BaseCaseComponent } from '@abstracts/base-case-component';
import { SaveTypes } from '@enums/save-types';
import { OperationType } from '@enums/operation-type';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { filter, map, switchMap, take, takeUntil, tap } from 'rxjs/operators';
import { CaseFolder } from '@models/case-folder';
import { DateAdapter } from '@angular/material/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Violation } from '@models/violation';
import { OffenderListComponent } from '@standalone/components/offender-list/offender-list.component';
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
import { OffenderViolationService } from '@services/offender-violation.service';
import { OpenedInfoContract } from '@contracts/opened-info-contract';
import { ReportType } from '@app-types/validation-return-type';
import { ClassificationTypes } from '@enums/violation-classification';
import { ViolationDegreeConfidentiality } from '@enums/violation-degree-confidentiality.enum';
import { SummaryTabComponent } from '@standalone/components/summary-tab/summary-tab.component';
import { Penalty } from '@models/penalty';
import { CaseAttachmentsComponent } from '@standalone/components/case-attachments/case-attachments.component';

@Component({
  selector: 'app-investigation',
  templateUrl: './investigation.component.html',
  styleUrls: ['./investigation.component.scss'],
})
export class InvestigationComponent
  extends BaseCaseComponent<Investigation, InvestigationService>
  implements AfterViewInit
{
  ngAfterViewInit(): void {
    Promise.resolve().then(() => {
      // this.updateIsMandatoryToImposePenalty.set(Math.random());
      this.summaryTabComponent?.offendersViolationsPreview.penaltiesLoaded$
        .pipe(takeUntil(this.destroy$))
        .subscribe(penalties => {
          this.penaltyMap.set(penalties);
          this.updateIsMandatoryToImposePenalty.set(Math.random());
        });
    });
  }

  lang = inject(LangService);
  route = inject(ActivatedRoute);
  fb = inject(UntypedFormBuilder);
  dialog = inject(DialogService);
  form!: UntypedFormGroup;
  service = inject(InvestigationService);
  employeeService = inject(EmployeeService);
  router = inject(Router);
  activeRoute = inject(ActivatedRoute);
  toast = inject(ToastService);
  encryptionService = inject(EncryptionService);
  lookupService = inject(LookupService);
  offenderViolationService = inject(OffenderViolationService);
  adapter = inject(DateAdapter);
  info = input<OpenedInfoContract | null>(null);
  @ViewChild(SummaryTabComponent)
  summaryTabComponent?: SummaryTabComponent;
  canReferralCase: boolean = false;
  @ViewChild(ViolationListComponent)
  violationListComponent!: ViolationListComponent;
  @ViewChild(OffenderListComponent)
  offenderListComponent!: OffenderListComponent;
  @ViewChild(WitnessesListComponent)
  witnessesListComponent!: WitnessesListComponent;
  @ViewChild('generalAttachments')
  generalAttachments!: CaseAttachmentsComponent;
  @ViewChild('officialAttachments')
  officialAttachments!: CaseAttachmentsComponent;
  violationDegreeConfidentiality =
    this.lookupService.lookups.securityLevel.filter(
      degreeConfidentiality =>
        this.employeeService.hasPermissionTo('LIMITED_ACCESS') ||
        degreeConfidentiality.lookupKey !==
          ViolationDegreeConfidentiality.LIMITED_CIRCULATION,
    );
  penaltyMap = signal<Record<number, { first: number; second: Penalty[] }>>({});
  updateIsMandatoryToImposePenalty = signal<undefined | number>(undefined);
  isMandatoryToImposePenalty = computed(() => {
    return !!(
      this.updateIsMandatoryToImposePenalty() &&
      this.summaryTabComponent &&
      this.summaryTabComponent.offendersViolationsPreview.isMandatoryToImposePenalty()
    );
  });
  tabsArray = [
    'summary',
    'basic_info',
    'offenders',
    'violations',
    'external_persons',
    'attachments',
  ];
  caseFolders: CaseFolder[] = [];
  caseFoldersMap?: Record<string, CaseFolder>;
  selectedTab = 0;

  updateModel$: BehaviorSubject<null> = new BehaviorSubject(null);
  offendersMappedWIthViolations: Offender[] = [];

  protected override _init() {
    super._init();
    this.info()
      ? (this.model = this.info()!.model as unknown as Investigation)
      : (this.model = new Investigation());

    this._listenToLoadOffendersViolations();
  }

  isHrManager() {
    return this.employeeService.isHrManager();
  }

  showSummaryElements() {
    return !!this.model.id;
  }

  canSave() {
    return this.canEdit() || !this.model.id;
  }

  canEdit() {
    return (
      this.model.getCaseStatus() === CommonCaseStatus.NEW ||
      this.model.getCaseStatus() === CommonCaseStatus.DRAFT ||
      this.model.getCaseStatus() === CommonCaseStatus.RETURNED ||
      this.model.getCaseStatus() === CommonCaseStatus.RETURN_TO_SAME_EMPLOYEE
    );
  }

  _buildForm(): void {
    this.form = this.fb.group(this.model.buildForm(true, this.readonly));
    this.listenToLocationChange();
    if (!this.hasLimitedAccess()) {
      this.violationDegreeConfidentiality =
        this.violationDegreeConfidentiality.filter(
          securityLevel =>
            securityLevel.lookupKey !==
            ViolationDegreeConfidentiality.LIMITED_CIRCULATION,
        );
      this.form.get('securityLevel')?.disable();
    }
  }

  canViewExternalPersonsTab() {
    return this.employeeService.hasPermissionTo('VIEW_WITNESS');
  }

  _afterBuildForm(): void {
    this.loadCaseFolders();
  }

  _beforeSave(_saveType: SaveTypes): boolean | Observable<boolean> {
    if (this.form.invalid) {
      this.dialog.error(this.lang.map.invalid_investigation_data);
      return false;
    }
    !this.model.violationInfo.length &&
      !this.model.offenderInfo.length &&
      this.dialog.error(
        this.lang.map.add_violation_or_offender_first_to_take_this_action,
      );
    return (
      !!this.model.violationInfo.length || !!this.model.offenderInfo.length
    );
  }

  _prepareModel(): Investigation | Observable<Investigation> {
    return new Investigation().clone<Investigation>({
      ...this.model,
      ...this.form.getRawValue(),
    });
  }

  _afterSave(
    model: Investigation,
    _saveType: SaveTypes,
    _operation: OperationType,
  ): void {
    this.model = model;
    if (this.operation === OperationType.UPDATE) {
      this.toast.success(
        this.lang.map.msg_save_x_success.change({ x: model.draftFullSerial }),
      );
    }

    this.loadCaseFolders();
  }

  _beforeLaunch(): boolean | Observable<boolean> {
    console.log(
      'this.model.hasValidOffenders()',
      this.model.hasValidOffenders(),
    );
    console.log('this.model.hasViolations()', this.model.hasViolations());
    console.log('this.model.hasOffenders()', this.model.hasOffenders());

    if (!this.model.hasViolations()) {
      this.dialog.error(this.lang.map.add_violation_first_to_take_this_action);
      return false;
    } else if (this.model.hasOffenders() && !this.model.hasValidOffenders()) {
      this.dialog.error(this.lang.map.link_violations_offenders);
      return false;
    } else {
      return true;
    }
  }

  _afterLaunch(): void {
    this._updateForm(new Investigation());
    this.toast.success(this.lang.map.request_has_been_sent_successfully);
    this.navigateToSamePageThatUserCameFrom();
  }

  managerLaunch() {
    // TODO: add manager launch logic
  }

  _updateForm(model: Investigation): void {
    this.handleReadOnly();
    if (!model.id) this.resetForm();
    this.model = model;
    this.form.patchValue(model.buildForm(false, this.readonly));
  }

  handleReadOnly() {
    if (!this.model.id) {
      return;
    }
    // let caseStatus = this.model.getCaseStatus();
    if (this.openFrom === OpenFrom.USER_INBOX) {
      //
    } else if (this.openFrom === OpenFrom.TEAM_INBOX) {
      if (this.model.isClaimed()) {
        this.readonly = false;
      }
    } else if (this.openFrom === OpenFrom.SEARCH) {
      if (this.model.canCommit()) {
        this.readonly = false;
      }
    }
  }

  getReportType(): ReportType {
    return !this.model.violationInfo.length
      ? 'None'
      : !this.model.violationInfo.find(v => {
            return v.classificationInfo.id === ClassificationTypes.criminal;
          })
        ? 'Normal'
        : 'Creminal';
  }

  private _listenToLoadOffendersViolations() {
    this.updateModel$.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.model = new Investigation().clone<Investigation>({
        ...this.model,
      });
    });
  }

  saveCase() {
    of(new Investigation().clone<Investigation>(this.form.value))
      .pipe(
        tap(_ => {
          this.form.invalid &&
            this.dialog.error(
              this.lang.map.msg_make_sure_all_required_fields_are_filled,
            );
        }),
        filter(() => this.form.valid),
        switchMap(model => {
          return model.save();
        }),
      )
      .subscribe((model: Investigation) => {
        this.model = model;
        this._updateForm(model);
        this.updateRoute();
        this.loadCaseFolders();
      });
  }

  navigateToSamePageThatUserCameFrom(): void {
    if (this.info === null) {
      return;
    }
    switch (this.info()?.openFrom) {
      case OpenFrom.TEAM_INBOX:
        this.router.navigate(['/home/electronic-services/team-inbox']).then();
        break;
      case OpenFrom.USER_INBOX:
        this.router.navigate(['/home/electronic-services/user-inbox']).then();
        break;
      case OpenFrom.SEARCH:
        this.router
          .navigate(['/home/electronic-services/investigation-search'])
          .then();
        break;
      case OpenFrom.DRAFT_SCREEN:
        this.router
          .navigate(['/home/electronic-services/investigation-drafts'])
          .then();
        break;
    }
  }

  loadCaseFolders(): void {
    if (!this.model) return;
    // if there is no folders load it
    if (!this.caseFolders.length && this.model.id) {
      this.model
        .getService()
        .loadCaseFolders(this.model.id)
        .pipe(map(folders => (this.caseFolders = folders)))
        .subscribe(() => {
          this.createFoldersMap();
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
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.launch$.next(null));
  }

  tabChange($event: number, withParams: boolean = true) {
    const selectedTab = this.tabsArray[$event];
    this.router
      .navigate([], {
        relativeTo: this.activeRoute,
        queryParams: {
          ...(withParams ? this.activeRoute.snapshot.queryParams : undefined),
          tab: selectedTab,
        },
      })
      .then();
  }

  resetForm() {
    this.violationListComponent.resetDataList();
    this.offenderListComponent.resetDataList();
    this.witnessesListComponent.resetDataList();
    this.updateModel$.next(null);
    this.caseFolders = [];
    this.caseFoldersMap = undefined;
    this.generalAttachments.resetDataList();
    this.officialAttachments.resetDataList();
    this.tabChange(0, false);
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

  updateRoute(): void {
    if (this.model)
      this.router
        .navigate([], {
          relativeTo: this.route,
          queryParams: {
            ...this.route.snapshot.queryParams,
            item: this.encryptionService.encrypt<INavigatedItem>({
              openFrom: OpenFrom.ADD_SCREEN,
              taskId: this.model.id,
              caseId: this.model.id,
              caseType: this.model.caseType,
            }),
          },
        })
        .then();
  }

  createFoldersMap(): void {
    this.caseFoldersMap = this.caseFolders.reduce(
      (acc, item) => {
        return { ...acc, [item.name.toLowerCase()]: item };
      },
      {} as Record<string, CaseFolder>,
    );
  }

  get subject() {
    return this.form.get('subject');
  }

  hasValidInvestigationSubject(): boolean {
    return !!this.subject?.valid;
  }

  focusInvalidTab() {
    if (!this.hasValidInvestigationSubject()) {
      this.selectedTab = 0;
      this.subject?.markAsTouched();
    }
  }

  updateViolations($event: Violation[]) {
    this.model!.violationInfo = $event;
  }

  hasLimitedAccess() {
    return this.employeeService.hasPermissionTo('LIMITED_ACCESS');
  }

  reloadPenalties() {
    this.summaryTabComponent &&
      this.summaryTabComponent?.offendersViolationsPreview.loadPenalties$.next();
  }
}
