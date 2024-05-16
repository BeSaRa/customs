import { Component, inject, input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { LangService } from '@services/lang.service';
import { BaseCaseComponent } from '@abstracts/base-case-component';
import { Investigation } from '@models/investigation';
import { Grievance } from '@models/grievance';
import { GrievanceService } from '@services/grievance.service';
import { UntypedFormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ButtonsCaseWrapperComponent } from '@standalone/components/buttons-case-wrapper/buttons-case-wrapper.component';
import { MatCard } from '@angular/material/card';
import { MatTab, MatTabGroup } from '@angular/material/tabs';
import { OpenFrom } from '@enums/open-from';
import { OpenedInfoContract } from '@contracts/opened-info-contract';
import { CaseAttachmentsComponent } from '@standalone/components/case-attachments/case-attachments.component';

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
  info = input<OpenedInfoContract | null>(null);
  form!: UntypedFormGroup;
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
}
