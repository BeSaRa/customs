import { Component, inject, input } from '@angular/core';
import { LangService } from '@services/lang.service';
import { BaseCaseComponent } from '@abstracts/base-case-component';
import { Investigation } from '@models/investigation';
import { Grievance } from '@models/grievance';
import { GrievanceService } from '@services/grievance.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subject, switchMap } from 'rxjs';
import { ButtonsCaseWrapperComponent } from '@standalone/components/buttons-case-wrapper/buttons-case-wrapper.component';
import { MatCard } from '@angular/material/card';
import { MatTab, MatTabGroup } from '@angular/material/tabs';
import { OpenFrom } from '@enums/open-from';
import { OpenedInfoContract } from '@contracts/opened-info-contract';
import { CaseAttachmentsComponent } from '@standalone/components/case-attachments/case-attachments.component';
import { FolderType } from '@enums/folder-type.enum';
import { LookupService } from '@services/lookup.service';
import { DialogService } from '@services/dialog.service';
import { IconButtonComponent } from '@standalone/components/icon-button/icon-button.component';
import { MatTooltip } from '@angular/material/tooltip';
import { GrievanceCommentPopupComponent } from '@standalone/popups/grievance-comment-popup/grievance-comment-popup.component';
import { UntypedFormGroup } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { GrievanceFinalDecisionsEnum } from '@enums/grievance-final-decisions-enum';

@Component({
  selector: 'app-grievance',
  standalone: true,
  imports: [
    ButtonsCaseWrapperComponent,
    MatCard,
    MatTab,
    MatTabGroup,
    CaseAttachmentsComponent,
    IconButtonComponent,
    MatTooltip,
    DatePipe,
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
  info = input<OpenedInfoContract | null>(null);
  form!: UntypedFormGroup;
  comment$: Subject<Grievance> = new Subject<Grievance>();

  protected override _init() {
    super._init();
    this.listenToComment();
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
}
