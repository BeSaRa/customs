import { DialogRef } from '@angular/cdk/dialog';
import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { OffenderViolation } from '@models/offender-violation';
import { Violation } from '@models/violation';
import { LangService } from '@services/lang.service';
import { OffenderViolationService } from '@services/offender-violation.service';
import { ButtonComponent } from '@standalone/components/button/button.component';
import { IconButtonComponent } from '@standalone/components/icon-button/icon-button.component';
import { ViolationListComponent } from '@standalone/components/violation-list/violation-list.component';
import { Subject, switchMap, takeUntil } from 'rxjs';

@Component({
  selector: 'app-violation-link-popup',
  standalone: true,
  imports: [CommonModule, ViolationListComponent, ButtonComponent, IconButtonComponent],
  templateUrl: './violation-link-popup.component.html',
  styleUrls: ['./violation-link-popup.component.scss'],
})
export class ViolationLinkPopupComponent implements OnDestroy {
  data = inject(MAT_DIALOG_DATA);
  lang = inject(LangService);
  offenderViolationService = inject(OffenderViolationService);
  dialogRef = inject(DialogRef);
  caseId: string = this.data && this.data.caseId;
  offenderId: number = this.data && this.data.offenderId;
  select$: Subject<Violation> = new Subject<Violation>();
  destroy$: Subject<void> = new Subject<void>();

  constructor() {
    this.listenToSelect();
  }

  private listenToSelect() {
    this.select$
      .pipe(takeUntil(this.destroy$))
      .pipe(
        switchMap((violation: Violation) => {
          const offenderViolationLink = new OffenderViolation();
          offenderViolationLink.status = 1;
          offenderViolationLink.caseId = this.caseId;
          offenderViolationLink.violationId = violation.id;
          offenderViolationLink.offenderId = this.offenderId;
          return this.offenderViolationService.create(offenderViolationLink);
        })
      )
      .subscribe(() => {
        this.dialogRef.close();
      });
  }
  ngOnDestroy(): void {
    this.destroy$.next();
  }
}
