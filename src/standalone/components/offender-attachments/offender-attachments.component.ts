import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, inject } from '@angular/core';
import { OffenderTypes } from '@enums/offender-types';
import { OnDestroyMixin } from '@mixins/on-destroy-mixin';
import { AppTableDataSource } from '@models/app-table-data-source';
import { Investigation } from '@models/investigation';
import { Offender } from '@models/offender';
import { DialogService } from '@services/dialog.service';
import { LangService } from '@services/lang.service';
import { OffenderAttachmentPopupComponent } from '@standalone/popups/offender-attachment-popup/offender-attachment-popup.component';
import { Subject, switchMap } from 'rxjs';
import { IconButtonComponent } from '../icon-button/icon-button.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { LookupService } from '@services/lookup.service';
import { Lookup } from '@models/lookup';
import { OffenderService } from '@services/offender.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-offender-attachments',
  standalone: true,
  imports: [
    CommonModule,
    IconButtonComponent,
    MatMenuModule,
    MatSortModule,
    MatTableModule,
    MatTooltipModule,
  ],
  templateUrl: './offender-attachments.component.html',
  styleUrl: './offender-attachments.component.scss',
})
export class OffenderAttachmentsComponent
  extends OnDestroyMixin(class {})
  implements OnInit
{
  lang = inject(LangService);
  dialog = inject(DialogService);
  lookupService = inject(LookupService);
  offenderService = inject(OffenderService);
  offenderTypes = OffenderTypes;
  dataSource = new AppTableDataSource<Offender>([]);
  attachments$: Subject<Offender> = new Subject<Offender>();
  firstTimeToLoadCount = true;
  offenderAttachmentsCountMap = new Map();

  @Input({ required: true }) set data(offenders: Offender[]) {
    offenders
      .filter(o => !this.offenderAttachmentsCountMap.has(o.id))
      .forEach(o => {
        this.offenderAttachmentsCountMap.set(o.id, 0);
      });
    this.dataSource = new AppTableDataSource(offenders);
    if (this.firstTimeToLoadCount && offenders.length) {
      this.loadOffenderAttachmentsCount();
      this.firstTimeToLoadCount = false;
    }
  }

  @Input() investigationModel?: Investigation;
  @Input() readOnly = true;

  displayedColumns = ['offenderName', 'qid', 'attachmentsCount', 'attachments'];
  offenderTypesMap: Record<number, Lookup> =
    this.lookupService.lookups.offenderType.reduce(
      (acc, item) => ({
        ...acc,
        [item.lookupKey]: item,
      }),
      {},
    );

  ngOnInit(): void {
    this.listenToAttachments();
  }
  loadOffenderAttachmentsCount() {
    this.offenderService
      .getAttachmentsCount(this.dataSource.data.map(o => o.id))
      .subscribe(offenders => {
        offenders.forEach(offender => {
          this.offenderAttachmentsCountMap.set(
            offender.id,
            offender.attachmentCount,
          );
        });
      });
  }
  private listenToAttachments() {
    this.attachments$
      .pipe(
        switchMap(model =>
          this.dialog
            .open(OffenderAttachmentPopupComponent, {
              data: {
                model: this.investigationModel,
                offenderId: model.id,
                readonly: this.readOnly,
              },
            })
            .afterClosed()
            .pipe(
              map(length => {
                return { offenderId: model.id, attachmentsNumber: length };
              }),
            ),
        ),
      )
      .subscribe(payload => {
        this.offenderAttachmentsCountMap.set(
          payload.offenderId,
          payload.attachmentsNumber,
        );
      });
  }
}
