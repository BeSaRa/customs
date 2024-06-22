import { Component, inject, input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { LangService } from '@services/lang.service';
import { BaseCaseComponent } from '@abstracts/base-case-component';
import { Investigation } from '@models/investigation';
import { Grievance } from '@models/grievance';
import { GrievanceService } from '@services/grievance.service';
import {
  FormControl,
  ReactiveFormsModule,
  UntypedFormGroup,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subject, switchMap, tap } from 'rxjs';
import { ButtonsCaseWrapperComponent } from '@standalone/components/buttons-case-wrapper/buttons-case-wrapper.component';
import { MatCard } from '@angular/material/card';
import { MatTab, MatTabGroup } from '@angular/material/tabs';
import { OpenFrom } from '@enums/open-from';
import { OpenedInfoContract } from '@contracts/opened-info-contract';
import { CaseAttachmentsComponent } from '@standalone/components/case-attachments/case-attachments.component';
import { FolderType } from '@enums/folder-type.enum';
import { LookupService } from '@services/lookup.service';
import { ActivitiesName } from '@enums/activities-name';
import { CustomValidators } from '@validators/custom-validators';
import { SelectInputComponent } from '@standalone/components/select-input/select-input.component';
import { GrievanceFinalDecisionsEnum } from '@enums/grievance-final-decisions-enum';
import { Penalty } from '@models/penalty';
import { DialogService } from '@services/dialog.service';

@Component({
  selector: 'app-grievance',
  standalone: true,
  imports: [
    DatePipe,
    ButtonsCaseWrapperComponent,
    MatCard,
    MatTab,
    MatTabGroup,
    CaseAttachmentsComponent,
    SelectInputComponent,
    ReactiveFormsModule,
  ],
  templateUrl: './grievance.component.html',
  styleUrl: './grievance.component.scss',
})
export class GrievanceComponent extends BaseCaseComponent<
  Grievance,
  GrievanceService
> {
  lang = inject(LangService);
  route = inject(ActivatedRoute);
  router = inject(Router);
  service = inject(GrievanceService);
  lookupService = inject(LookupService);
  dialog = inject(DialogService);
  grievanceFinalDecisions = this.lookupService.lookups.GrievanceFinalDecision;
  grievanceFinalDecisionsCtrl = new FormControl(null);
  penaltyCtrl = new FormControl(null);
  info = input<OpenedInfoContract | null>(null);
  form!: UntypedFormGroup;
  penaltiesList: Penalty[] = [];
  updateModel$ = new Subject<void>();

  protected override _init() {
    super._init();
    this.listenToUpdateModel();
    // this.loadPenalties().subscribe();
    if (
      this.model.getActivityName() === ActivitiesName.SUBMIT_GRIEVANCE_PRESIDENT
    ) {
      this.grievanceFinalDecisionsCtrl.setValidators([
        CustomValidators.required,
      ]);
    }
  }
  listenToUpdateModel() {
    this.updateModel$
      .pipe(
        tap(() => {
          this.model = new Grievance().clone<Grievance>({
            ...this.model,
            penaltyId: this.penaltyCtrl.value as unknown as number,
            finalDecision: this.grievanceFinalDecisionsCtrl
              .value as unknown as number,
          });
        }),
      )
      .pipe(switchMap(() => this.model.save()))
      .subscribe();
  }
  _buildForm(): void {}
  // private loadPenalties() {
  //   return this.model
  //     ? this.model
  //         .getService()
  //         .getCasePenalty(
  //           this.model.id as string,
  //           this.model.getActivityName()!,
  //         )
  //     : of(
  //         {} as Record<string, { first: ManagerDecisions; second: Penalty[] }>,
  //       );
  // }
  _afterBuildForm(): void {}
  _beforeSave(): boolean | Observable<boolean> {
    if (this.grievanceFinalDecisionsCtrl.valid || this.penaltyCtrl.valid) {
      this.dialog.error(
        this.lang.map.msg_make_sure_all_required_fields_are_filled,
      );
    }
    return this.grievanceFinalDecisionsCtrl.valid && this.penaltyCtrl.valid;
  }
  _beforeLaunch(): boolean | Observable<boolean> {
    return true;
  }
  _prepareModel(): Grievance | Observable<Grievance> {
    return new Grievance().clone<Grievance>({
      ...this.model,
    });
  }
  _afterSave(): void {}
  _afterLaunch(): void {}
  _handleReadOnly(): void {
    this.readonly = true;
    if (!this.model.inMyInbox()) {
      this.grievanceFinalDecisionsCtrl.disable();
    } else {
      this.grievanceFinalDecisionsCtrl.enable();
    }
  }
  handleFinalDecisionChanged(decision: unknown) {
    this.penaltyCtrl.setValidators([]);
    if (decision === GrievanceFinalDecisionsEnum.UPDATE_PENALTY) {
      this.penaltyCtrl.setValidators([CustomValidators.required]);
    }
  }
  _updateForm(model: Investigation | Grievance): void {
    this.model = model as Grievance;
    this._handleReadOnly();
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
    }
  }

  protected readonly FolderType = FolderType;
  protected readonly ActivitiesName = ActivitiesName;
  protected readonly GrievanceFinalDecisionsEnum = GrievanceFinalDecisionsEnum;
}
