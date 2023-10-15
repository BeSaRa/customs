import { Component, inject } from '@angular/core';
import { LangService } from '@services/lang.service';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { InvestigationService } from '@services/investigation.service';
import { Investigation } from '@models/investigation';
import { BaseCaseComponent } from '@abstracts/base-case-component';
import { SaveTypes } from '@enums/save-types';
import { OperationType } from '@enums/operation-type';
import { filter, map, Observable, take, takeUntil } from 'rxjs';
import { CaseFolder } from '@models/case-folder';
import { DateAdapter } from '@angular/material/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-investigation',
  templateUrl: './investigation.component.html',
  styleUrls: ['./investigation.component.scss'],
})
export class InvestigationComponent extends BaseCaseComponent<Investigation, InvestigationService> {
  lang = inject(LangService);
  fb = inject(UntypedFormBuilder);
  form!: UntypedFormGroup;
  service = inject(InvestigationService);
  router = inject(Router);
  activeRoute = inject(ActivatedRoute);
  location = inject(Location);
  // mock data
  model: Investigation = new Investigation().clone<Investigation>({
    id: '{75388091-006E-CD67-8829-8AD3C1900000}',
    draftFullSerial: 'INV/PUB/2023/45',
    createdOn: '2023-09-26T23:09:53.680+00:00',
  });

  caseFolders: CaseFolder[] = [];

  caseFoldersMap?: Record<string, CaseFolder>;

  adapter = inject(DateAdapter);
  selectedTab = 0;

  tabsArray = ['basic_info', 'violations', 'offenders', 'external_persons'];

  protected override _init() {
    super._init();
  }

  getSecurityLevel(limitedAccess: boolean): string {
    return this.lang.map[limitedAccess as unknown as 'true' | 'false'];
  }

  _buildForm(): void {
    this.form = this.fb.group(this.model.buildForm(true));
    this.listenToLocationChange();
  }

  _afterBuildForm(): void {
    //throw new Error('Method not implemented.');
    this.loadCaseFolders();
  }

  _beforeSave(saveType: SaveTypes): boolean | Observable<boolean> {
    //throw new Error('Method not implemented.');
    return true;
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

  _updateForm(model: Investigation): void {
    this.form.patchValue(model.buildForm());
  }

  loadCaseFolders(): void {
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

  tabChange($event: number) {
    const selectedTab = this.tabsArray[$event];
    // console.log(location);
    this.router
      .navigate([], {
        relativeTo: this.activeRoute,
        queryParams: { tab: selectedTab },
      })
      .then();
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
}
