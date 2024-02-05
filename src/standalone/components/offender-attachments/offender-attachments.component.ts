import { CommonModule } from '@angular/common';
import { Component, effect, inject, Input, input, OnInit } from '@angular/core';
import { OffenderTypes } from '@enums/offender-types';
import { OnDestroyMixin } from '@mixins/on-destroy-mixin';
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
  attachments$: Subject<Offender> = new Subject<Offender>();
  firstTimeToLoadCount = true;
  offenderAttachmentsCountMap = new Map();

  constructor() {
    super();
    effect(() => {
      if (this.model()) {
        this.model()
          .offenderInfo.filter(o => !this.offenderAttachmentsCountMap.has(o.id))
          .forEach(o => {
            this.offenderAttachmentsCountMap.set(o.id, 0);
          });
        if (this.firstTimeToLoadCount && this.model().offenderInfo.length) {
          this.loadOffenderAttachmentsCount();
          this.firstTimeToLoadCount = false;
        }
      }
    });
  }

  @Input() investigationModel?: Investigation;
  @Input() readOnly = true;

  model = input.required<Investigation>();

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
  getAttachmentsCountValue(offender: Offender) {
    return !this.offenderAttachmentsCountMap.get(offender.id)
      ? this.lang.map.no_attachments
      : this.offenderAttachmentsCountMap.get(offender.id) +
          ' ' +
          (this.offenderAttachmentsCountMap.get(offender.id) === 1
            ? this.lang.map.attachment
            : this.lang.map.lbl_attachments);
  }
  loadOffenderAttachmentsCount() {
    this.offenderService
      .getAttachmentsCount(this.model().offenderInfo.map(o => o.id))
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
        switchMap(model => {
          console.log(model);
          return this.dialog
            .open(OffenderAttachmentPopupComponent, {
              data: {
                model: this.model,
                offenderId: model.id,
                readonly: this.readOnly,
              },
            })
            .afterClosed()
            .pipe(
              map(length => {
                console.log(length);
                return { offenderId: model.id, attachmentsNumber: length };
              }),
            );
        }),
      )
      .subscribe(payload => {
        this.offenderAttachmentsCountMap.set(
          payload.offenderId,
          payload.attachmentsNumber,
        );
      });
  }
}
