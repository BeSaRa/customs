import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { OnDestroyMixin } from '@mixins/on-destroy-mixin';
import { LangService } from '@services/lang.service';
import { ButtonComponent } from '@standalone/components/button/button.component';
import { IconButtonComponent } from '@standalone/components/icon-button/icon-button.component';
import { InputComponent } from '@standalone/components/input/input.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SelectInputComponent } from '@standalone/components/select-input/select-input.component';
import { SwitchComponent } from '@standalone/components/switch/switch.component';
import { MatIconModule } from '@angular/material/icon';
import { AppIcons } from '@constants/app-icons';
import { CaseAttachment } from '@models/case-attachment';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatTooltipModule } from '@angular/material/tooltip';
import { combineLatest, exhaustMap, Subject } from 'rxjs';
import { BaseCaseService } from '@abstracts/base-case.service';

@Component({
  selector: 'app-case-attachment-popup',
  standalone: true,
  imports: [
    CommonModule,
    ButtonComponent,
    IconButtonComponent,
    InputComponent,
    MatDialogModule,
    ReactiveFormsModule,
    SelectInputComponent,
    SwitchComponent,
    MatIconModule,
    MatTableModule,
    MatSortModule,
    MatTooltipModule,
  ],
  templateUrl: './case-attachment-popup.component.html',
  styleUrls: ['./case-attachment-popup.component.scss'],
})
export class CaseAttachmentPopupComponent extends OnDestroyMixin(class {}) implements OnInit {
  data: { caseId: string; service: BaseCaseService<unknown> } = inject(MAT_DIALOG_DATA);
  lang = inject(LangService);
  view$ = new Subject<CaseAttachment>();
  delete$ = new Subject<CaseAttachment>();
  save$: Subject<void> = new Subject<void>();
  attachments: CaseAttachment[] = [];
  displayedColumns: string[] = ['documentTitle', 'attachmentType', 'actions'];

  ngOnInit(): void {
    this.startUploadingFiles();
  }

  protected readonly AppIcons = AppIcons;

  filesDropped($event: DragEvent) {
    $event.preventDefault();

    if (!$event.dataTransfer) return;
    if (!$event.dataTransfer.files) return;
    Array.from($event.dataTransfer.files).forEach(item => {
      if (!this.validFile(item)) {
        return;
      }
      this.attachments = [
        ...this.attachments,
        new CaseAttachment().clone<CaseAttachment>({
          content: item,
          documentTitle: item.name,
          attachmentTypeId: 1,
        }),
      ];
    });
  }

  validFile(file: File): boolean {
    return true;
  }

  private startUploadingFiles() {
    this.save$
      .pipe(
        exhaustMap(() => {
          return combineLatest(
            this.attachments.map(attachment => {
              return this.data.service.addCaseAttachment(this.data.caseId, attachment);
            })
          );
        })
      )
      .subscribe(res => {
        console.log(res);
      });
  }
}
