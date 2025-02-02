import { BaseCaseComponent } from '@abstracts/base-case-component';
import { DatePipe } from '@angular/common';
import { Component, inject, input, signal } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { MatCard } from '@angular/material/card';
import { MatTooltip } from '@angular/material/tooltip';
import { ActivatedRoute, Router } from '@angular/router';
import { OpenedInfoContract } from '@contracts/opened-info-contract';
import { ActivitiesName } from '@enums/activities-name';
import { FolderType } from '@enums/folder-type.enum';
import { GrievanceFinalDecisionsEnum } from '@enums/grievance-final-decisions-enum';
import { OpenFrom } from '@enums/open-from';
import { Grievance } from '@models/grievance';
import { Investigation } from '@models/investigation';
import { Offender } from '@models/offender';
import { DialogService } from '@services/dialog.service';
import { EmployeeService } from '@services/employee.service';
import { GrievanceService } from '@services/grievance.service';
import { LangService } from '@services/lang.service';
import { LookupService } from '@services/lookup.service';
import { StatementService } from '@services/statement.service';
import { ButtonsCaseWrapperComponent } from '@standalone/components/buttons-case-wrapper/buttons-case-wrapper.component';
import { CaseAttachmentsComponent } from '@standalone/components/case-attachments/case-attachments.component';
import { IconButtonComponent } from '@standalone/components/icon-button/icon-button.component';
import { GrievanceCommentPopupComponent } from '@standalone/popups/grievance-comment-popup/grievance-comment-popup.component';
import { Observable, Subject, switchMap } from 'rxjs';
import { SituationSearchBtnComponent } from '../situation-search-btn/situation-search-btn.component';
import { OffenderService } from '@services/offender.service';

@Component({
  selector: 'app-grievance',
  standalone: true,
  imports: [
    ButtonsCaseWrapperComponent,
    MatCard,
    CaseAttachmentsComponent,
    IconButtonComponent,
    MatTooltip,
    DatePipe,
    SituationSearchBtnComponent,
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
  employeeService = inject(EmployeeService);
  statementService = inject(StatementService);
  offenderService = inject(OffenderService);

  offender = signal<Offender | undefined>(undefined);

  info = input<OpenedInfoContract | null>(null);
  form!: UntypedFormGroup;
  comment$: Subject<Grievance> = new Subject<Grievance>();

  protected override _init() {
    super._init();
    this.loadOffenderData();
    this.listenToComment();
  }

  loadOffenderData() {
    this.offenderService
      .loadByIdComposite(this.model.offenderId)
      .subscribe(o => {
        this.offender.set(o);
      });
  }

  listenToComment() {
    this.comment$
      .pipe(
        switchMap((model: Grievance) => {
          return this.dialog
            .open(GrievanceCommentPopupComponent, {
              data: {
                model,
              },
            })
            .afterClosed();
        }),
      )
      .subscribe();
  }

  _buildForm(): void {}

  _afterBuildForm(): void {}
  _beforeSave(): boolean | Observable<boolean> {
    return true;
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
  protected readonly GrievanceFinalDecisionsEnum = GrievanceFinalDecisionsEnum;
  protected readonly ActivitiesName = ActivitiesName;

  hasRequestStatement() {
    return (
      !this.model.isReviewStatement() &&
      this.hasStatementCreatorPermission() &&
      !!this.model.id
    );
  }
  openRequestStatementDialog() {
    this.statementService.openRequestStatementDialog(this.model, true);
  }
  hasStatementCreatorPermission() {
    return this.employeeService.hasPermissionTo('STATEMENT_CREATOR');
  }
}
