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
  offenderTypes = OffenderTypes;
  dataSource = new AppTableDataSource<Offender>([]);
  attachments$: Subject<Offender> = new Subject<Offender>();
  @Input({ required: true }) set data(offenders: Offender[]) {
    this.dataSource = new AppTableDataSource(offenders);
  }

  @Input() investigationModel?: Investigation;
  @Input() readOnly = true;

  displayedColumns = [
    'offenderName',
    'qid',
    'departmentCompany',
    'attachments',
  ];
  offenderTypesMap: Record<number, Lookup> =
    this.lookupService.lookups.offenderType.reduce(
      (acc, item) => ({
        ...acc,
        [item.lookupKey]: item,
      }),
      {}
    );

  ngOnInit(): void {
    this.listenToAttachments();
  }

  private listenToAttachments() {
    this.attachments$
      .pipe(
        switchMap((model) =>
          this.dialog
            .open(OffenderAttachmentPopupComponent, {
              data: {
                model: this.investigationModel,
                offenderId: model.id,
                readonly: this.readOnly,
              },
            })
            .afterClosed()
        )
      )
      .subscribe();
  }
}
