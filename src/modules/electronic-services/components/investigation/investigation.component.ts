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
import { filter, map, Observable, take, takeUntil, Subject, switchMap, of } from 'rxjs';
import { CaseFolder } from '@models/case-folder';
import { DateAdapter } from '@angular/material/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { Violation } from '@models/violation';
import { OffenderListComponent } from '@standalone/components/offender-list/offender-list.component';
import { TransformerAction } from '@contracts/transformer-action';
import { ViolationListComponent } from '@standalone/components/violation-list/violation-list.component';
import { ToastService } from '@services/toast.service';
import { SendTypes } from '@enums/send-types';
import { OpenFrom } from '@enums/open-from';
import { INavigatedItem } from '@contracts/inavigated-item';
import { EncryptionService } from '@services/encryption.service';
import { TaskResponses } from '@enums/task-responses';
import { TeamPopupComponent } from '@modules/administration/popups/team-popup/team-popup.component';
import { CommentPopupComponent } from '@standalone/popups/comment-popup/comment-popup.component';
import { UserClick } from '@enums/user-click';

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
  router = inject(Router);
  activeRoute = inject(ActivatedRoute);
  location = inject(Location);
  toast = inject(ToastService);
  encrypt = inject(EncryptionService);
  responseAction$: Subject<TaskResponses> = new Subject<TaskResponses>();
  @ViewChild(ViolationListComponent) violationListComponent!: ViolationListComponent;
  @ViewChild(OffenderListComponent) offenderListComponent!: OffenderListComponent;
  @ViewChild(WitnessesListComponent) witnessestListComponent!: WitnessesListComponent;
  caseFolders: CaseFolder[] = [];
  sendTypes = SendTypes;

  caseFoldersMap?: Record<string, CaseFolder>;

  adapter = inject(DateAdapter);
  selectedTab = 0;

  tabsArray = ['basic_info', 'violations', 'offenders', 'external_persons'];
  violations: Violation[] = [];

  protected override _init() {
    super._init();
    this.listenToResponseAction();
  }
  listenToResponseAction() {
    this.responseAction$
      .pipe(takeUntil(this.destroy$))
      .pipe(
        switchMap((responce: TaskResponses) => {
          return this.dialog
            .open(CommentPopupComponent, {
              data: {
                model: this.model,
                responce,
              },
            })
            .afterOpened();
        })
      )
      .pipe(filter((click: any) => click == UserClick.YES))
      .subscribe();
  }
  getSecurityLevel(limitedAccess: boolean): string {
    return this.lang.map[limitedAccess as unknown as 'true' | 'false'];
  }

  _buildForm(): void {
    this.form = this.fb.group(this.model ? this.model.buildForm(true) : new Investigation().buildForm(true));
    this.listenToLocationChange();
  }

  _afterBuildForm(): void {
    this.loadCaseFolders();
  }

  _beforeSave(saveType: SaveTypes): boolean | Observable<boolean> {
    !this.violations.length && this.dialog.error(this.lang.map.add_violation_first_to_take_this_action);
    return !!this.violations.length;
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
  _updateForm(model: Investigation): void {
    if (!model.id) this.resetForm();
    this.model = model;
    this.form.patchValue(model.buildForm());
  }
  saveCase(e: Subject<TransformerAction<Investigation>>) {
    new Investigation().save().subscribe((model: Investigation) => {
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
  canLaunch() {
    return this.model?.canStart();
  }
}
