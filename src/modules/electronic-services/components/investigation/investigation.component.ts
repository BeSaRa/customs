import { BaseCaseComponent } from '@abstracts/base-case-component';
import {
  AfterViewInit,
  Component,
  computed,
  inject,
  input,
  signal,
  viewChild,
  ViewChild,
} from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
} from '@angular/forms';
import { DateAdapter } from '@angular/material/core';
import { MatTabGroup } from '@angular/material/tabs';
import { ActivatedRoute, Router } from '@angular/router';
import { ReportType } from '@app-types/validation-return-type';
import { AppPermissions } from '@constants/app-permissions';
import { INavigatedItem } from '@contracts/inavigated-item';
import { OpenedInfoContract } from '@contracts/opened-info-contract';
import { OpenFrom } from '@enums/open-from';
import { OperationType } from '@enums/operation-type';
import { SaveTypes } from '@enums/save-types';
import { SendTypes } from '@enums/send-types';
import { ClassificationTypes } from '@enums/violation-classification';
import { ViolationDegreeConfidentiality } from '@enums/violation-degree-confidentiality.enum';
import { CaseFolder } from '@models/case-folder';
import { Grievance } from '@models/grievance';
import { Investigation } from '@models/investigation';
import { Offender } from '@models/offender';
import { Penalty } from '@models/penalty';
import { Team } from '@models/team';
import { Violation } from '@models/violation';
import { ViolationClassification } from '@models/violation-classification';
import { DialogService } from '@services/dialog.service';
import { EmployeeService } from '@services/employee.service';
import { EncryptionService } from '@services/encryption.service';
import { InboxService } from '@services/inbox.services';
import { InvestigationService } from '@services/investigation.service';
import { LangService } from '@services/lang.service';
import { LookupService } from '@services/lookup.service';
import { TeamService } from '@services/team.service';
import { ToastService } from '@services/toast.service';
import { ViolationClassificationService } from '@services/violation-classification.service';
import { CaseAttachmentsComponent } from '@standalone/components/case-attachments/case-attachments.component';
import { LegalAffairsProceduresComponent } from '@standalone/components/legal-affairs-procedures/legal-affairs-procedures.component';
import { OffenderListComponent } from '@standalone/components/offender-list/offender-list.component';
import { SummaryTabComponent } from '@standalone/components/summary-tab/summary-tab.component';
import { ViolationListComponent } from '@standalone/components/violation-list/violation-list.component';
import { WitnessesListComponent } from '@standalone/components/witnesses-list/witnesses-list.component';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import {
  catchError,
  filter,
  map,
  retry,
  switchMap,
  take,
  takeUntil,
  tap,
} from 'rxjs/operators';
import { StatementService } from '@services/statement.service';
import { OrganizationUnit } from '@models/organization-unit';
import { OrganizationUnitService } from '@services/organization-unit.service';
import { CommonCaseStatus } from '@enums/common-case-status';
import { TaskResponses } from '@enums/task-responses';

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
  teamService = inject(TeamService);
  inboxService = inject(InboxService);
  statementService = inject(StatementService);
  router = inject(Router);
  activeRoute = inject(ActivatedRoute);
  toast = inject(ToastService);
  encryptionService = inject(EncryptionService);
  lookupService = inject(LookupService);
  adapter = inject(DateAdapter);
  violationClassificationService = inject(ViolationClassificationService);
  canManageInvestigationElements = true;
  protected readonly commonCaseStatus = CommonCaseStatus;
  organizationUnits!: OrganizationUnit[];
  organizationUnitService = inject(OrganizationUnitService);
  info = input<OpenedInfoContract | null>(null);
  @ViewChild(SummaryTabComponent)
  summaryTabComponent?: SummaryTabComponent;
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

  reviewStatementForm = new UntypedFormGroup({
    reviewerOuId: new UntypedFormControl(null, { nonNullable: true }),
    description: new UntypedFormControl(null),
    reply: new UntypedFormControl(undefined),
    statementSerial: new UntypedFormControl(undefined),
  });
  legalAffairsProceduresComponent = viewChild<LegalAffairsProceduresComponent>(
    'legalAffairsProceduresComponent',
  );

  tabsComponent = viewChild(MatTabGroup);

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
    'legal_procedures',
    'review_minutes',
    'summary',
    'basic_info',
    'offenders',
    'violations',
    'external_persons',
    'disciplinary_committee_meetings',
    'attachments',
    'call_requests',
  ];
  caseFolders: CaseFolder[] = [];
  caseFoldersMap?: Record<string, CaseFolder>;
  selectedTab = 0;

  updateModel$: BehaviorSubject<null> = new BehaviorSubject(null);
  offendersMappedWIthViolations: Offender[] = [];
  classificationsMap: Record<number, ViolationClassification> = {};
  classifications: ViolationClassification[] = [];

  protected override _init() {
    super._init();
    this.loadClassifications();
    this.info()
      ? (this.model = this.info()!.model as unknown as Investigation)
      : (this.model = new Investigation());

    this._listenToLoadOffendersViolations();
    this.listenToTabChange();
    this.claimIfAutoClaim();
    this.loadOrganizationUnits();
    if (this.model.isReviewStatement()) {
      this.setReviewStatementFormValues();
    }
  }

  claimIfAutoClaim() {
    this.teamService.loadAsLookups().subscribe((teams: Team[]) => {
      const autoClaim = !!teams.find(
        team => team.authName === this.model.getTeamAuthName(),
      )?.autoClaim;
      if (autoClaim) this.claimItem();
    });
  }

  claimItem() {
    this.model
      .claim()
      .pipe(take(1))
      .subscribe((model: Investigation) => {
        this.model.getPenaltyDecision().forEach(item => {
          model.appendPenaltyDecision(item);
        });
        this._updateForm(model);
      });
  }

  isHrManager() {
    return this.employeeService.isHrManager();
  }

  isInvestigator() {
    return this.employeeService.isInvestigator();
  }

  showSummaryElements() {
    return !!this.model.id;
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
    if (this.operation === OperationType.UPDATE) {
      this.toast.success(
        this.lang.map.msg_save_x_success.change({ x: model.draftFullSerial }),
      );
    }
  }

  _beforeLaunch(): boolean | Observable<boolean> {
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
    if (this.model.applicantDecision === SendTypes.SAVE_AND_PREPARE) {
      this._updateForm(this.model);
      this.inboxService
        .loadTeamInbox(-1)
        .pipe(
          switchMap(inbox => {
            const _case = inbox.items.find(
              item => item.PI_PARENT_CASE_ID === this.model.id,
            );
            if (!_case) {
              return throwError(() => 'Case not launched yet!');
            }
            return of(_case);
          }),
          retry(5),
        )
        .pipe(
          catchError(err => {
            this.navigateToSamePageThatUserCameFrom();
            this.toast.error(
              this.lang.map.an_error_occured_while_preparing_for_approve,
            );
            return throwError(() => err);
          }),
        )
        .subscribe(_case => {
          this.router.navigate([_case!.itemRoute], {
            queryParams: { item: _case!.itemDetails, reload: true },
            onSameUrlNavigation: 'reload',
          });
        });
    } else {
      this._updateForm(new Investigation());
      this.toast.success(this.lang.map.request_has_been_sent_successfully);
      this.navigateToSamePageThatUserCameFrom();
    }
  }

  managerLaunch() {
    // TODO: add manager launch logic
  }

  _updateForm(model: Investigation | Grievance): void {
    if (!model.id) this.resetForm();
    this.model = model as Investigation;
    this._handleReadOnly(this.model);
    this.form = this.fb.group(model.buildForm(model.canSave(), this.readonly));
    this._afterBuildForm();
  }

  get canManageOffendersAttachments() {
    return (
      this.employeeService.hasPermissionTo('EDIT_ATTACHMENTS') &&
      (this.model.inMyInbox() || this.model.inDisciplinaryCommitteeReview())
    );
  }

  _handleReadOnly(model: Investigation) {
    // reset readonly and canTakeAction
    this.readonly = false;
    this.canManageInvestigationElements = true; // specified for violations, offenders, external persons and attachments
    if (!model.id) return;
    // has model id
    if (!this.openFrom) {
      // this.openFrom === OpenFrom.ADD_SCREEN
      return;
    }
    if (
      (((!model.inMyInbox() && !this.isInvestigator()) || !model.canSave()) &&
        !model.isDrafted) ||
      model.isReviewStatement()
    ) {
      this.readonly = true;
      this.canManageInvestigationElements = false; // specified for violations, offenders, external persons and attachments
    }
  }

  getReportType(): ReportType {
    return !this.model.violationInfo.length
      ? 'None'
      : !this.model.violationInfo.find(v => {
            return (
              this.classificationsMap[v.classificationInfo.id]?.key ===
              ClassificationTypes.criminal
            );
          })
        ? 'Normal'
        : 'Creminal';
  }

  private prepareClassificationMap() {
    this.classificationsMap = this.classifications.reduce((acc, item) => {
      return { ...acc, [item.id]: item };
    }, {});
  }

  private loadClassifications(): void {
    this.violationClassificationService.loadAsLookups().subscribe(list => {
      this.classifications = list;
      this.prepareClassificationMap();
    });
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
        this._updateForm(model);
        this.updateRoute();
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
          .navigate(['/home/electronic-services/investigation-search'], {
            state: {
              ...this.info()?.searchCriteria,
              returnedFromInvestigation: true,
            },
          })
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
    if (!this.model || this._checkIfHasUnlinkedOffenders()) return;
    const _model = new Investigation().clone<Investigation>(this.model);
    this.model.applicantDecision = type;
    if (type === SendTypes.SAVE_AND_PREPARE) {
      _model.applicantDecision = this.employeeService.isApplicantChief()
        ? SendTypes.DIRECT_DEPARTMENT
        : SendTypes.DIRECTOR_ADMIN;
    } else {
      _model.applicantDecision = type;
    }
    _model
      .save()
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.launch$.next(null));
  }

  tabChange(tabName: string, withParams: boolean = true) {
    this.router
      .navigate([], {
        relativeTo: this.activeRoute,
        queryParams: {
          ...(withParams ? this.activeRoute.snapshot.queryParams : undefined),
          tab: tabName,
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
    this.form.reset();
    this.form.updateValueAndValidity();
    this.caseFoldersMap = undefined;
    this.generalAttachments.resetDataList();
    this.officialAttachments.resetDataList();
    this.selectedTab = 0;
    this.tabChange('basic_info', false);
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

  private listenToTabChange() {
    this.tabsComponent()
      ?.selectedTabChange.pipe(takeUntil(this.destroy$))
      .subscribe(tabEvent => {
        const tabName =
          tabEvent.tab._implicitContent.elementRef.nativeElement.parentElement
            .dataset['name'];
        this.tabChange(tabName);
      });
  }

  private _checkIfHasUnlinkedOffenders() {
    if ((this.model as unknown as Investigation).hasUnlinkedOffenders()) {
      this.dialog.error(
        this.lang.map
          .there_is_offenders_unlinked_to_violations_to_take_this_action,
      );
      return true;
    }
    return false;
  }

  isOpenedFromSearch(): boolean {
    if (this.info === null) {
      return false;
    }
    return this.info()?.openFrom === OpenFrom.SEARCH;
  }

  protected readonly AppPermissions = AppPermissions;

  openRequestStatementDialog() {
    this.statementService.openRequestStatementDialog(this.model);
  }

  hasStatementCreatorPermission() {
    return this.employeeService.hasPermissionTo('STATEMENT_CREATOR');
  }

  hasRequestStatement() {
    return (
      !this.model.isReviewStatement() &&
      this.model.caseState !== this.commonCaseStatus.DRAFT &&
      this.hasStatementCreatorPermission() &&
      !!this.model.id
    );
  }

  private loadOrganizationUnits() {
    this.organizationUnitService
      .loadAsLookups()
      .subscribe(ous => (this.organizationUnits = ous));
  }
  private initialDescriptionValue: string | null = null;

  private setReviewStatementFormValues() {
    const { reviewerOuId, description, reply, statementSerial } =
      this.model.getReviewStatementValues();
    this.reviewStatementForm.patchValue({
      reviewerOuId,
      description,
    });
    this.initialDescriptionValue = description ?? null;
    if (reply) {
      this.reviewStatementForm.get('reply')?.setValue(reply);
    }
    if (statementSerial) {
      this.reviewStatementForm
        .get('statementSerial')
        ?.setValue(statementSerial);
    }
    this.reviewStatementForm.disable();
    if (this.model.hasResponse(TaskResponses.STM_DEP_APPROVE)) {
      this.reviewStatementForm.get('description')?.enable();
    }
  }

  get isStatementReply() {
    return this.model.getResponses()?.includes(TaskResponses.STM_REPLY);
  }

  get hasStatementReply(): boolean {
    return !!this.reviewStatementForm.get('reply')?.value;
  }

  statementRequestEditable(): boolean {
    const descriptionControl = this.reviewStatementForm.get('description');
    return (
      this.model.hasResponse(TaskResponses.STM_DEP_APPROVE) &&
      this.model.isClaimed() &&
      descriptionControl?.value !== this.initialDescriptionValue
    );
  }

  editStatementRequestDescription() {
    this.service
      .updateStatementRequestDescription(
        this.model.taskDetails.activityProperties!.DescriptionId.value,
        this.reviewStatementForm.get('description')?.value,
      )
      .subscribe();
  }
}
