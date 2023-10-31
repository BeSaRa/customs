import { DialogRef } from '@angular/cdk/dialog';
import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { Violation } from '@models/violation';
import { DialogService } from '@services/dialog.service';
import { LangService } from '@services/lang.service';
import { OffenderViolationService } from '@services/offender-violation.service';
import { ButtonComponent } from '@standalone/components/button/button.component';
import { IconButtonComponent } from '@standalone/components/icon-button/icon-button.component';
import { ViolationListComponent } from '@standalone/components/violation-list/violation-list.component';
import { map, concatMap, Subject, switchMap, takeUntil, of, filter } from 'rxjs';
import { ViolationRepeatePopupComponent } from '../violation-repeate-popup/violation-repeate-popup.component';
import { OffenderViolation } from '@models/offender-violation';
import { UserClick } from '@enums/user-click';

@Component({
  selector: 'app-violation-link-popup',
  standalone: true,
  imports: [CommonModule, ViolationListComponent, MatDialogModule, ButtonComponent, IconButtonComponent],
  templateUrl: './violation-link-popup.component.html',
  styleUrls: ['./violation-link-popup.component.scss'],
})
export class ViolationLinkPopupComponent implements OnDestroy {
  data = inject(MAT_DIALOG_DATA);
  lang = inject(LangService);
  offenderViolationService = inject(OffenderViolationService);
  dialogRef = inject(DialogRef);
  dialog = inject(DialogService);
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
          return this.dialog
            .open(ViolationRepeatePopupComponent)
            .afterClosed()
            .pipe(filter(value => !!value))
            .pipe(
              switchMap((repeat: unknown) => {
                const offenderViolationLink = new OffenderViolation();
                offenderViolationLink.repeat = +(repeat as number);
                offenderViolationLink.status = 1;
                offenderViolationLink.caseId = this.caseId;
                offenderViolationLink.violationId = violation.id;
                offenderViolationLink.offenderId = this.offenderId;
                return this.offenderViolationService.create(offenderViolationLink);
              })
            );
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
