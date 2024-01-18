import { Component, inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { OnDestroyMixin } from '@mixins/on-destroy-mixin';
import { Investigation } from '@models/investigation';
import { DialogService } from '@services/dialog.service';
import { LangService } from '@services/lang.service';
import { ButtonComponent } from '@standalone/components/button/button.component';
import { CaseAttachmentsComponent } from '@standalone/components/case-attachments/case-attachments.component';
import { IconButtonComponent } from '@standalone/components/icon-button/icon-button.component';

@Component({
  selector: 'app-offender-attachment-popup',
  standalone: true,
  imports: [
    CaseAttachmentsComponent,
    MatDialogModule,
    ButtonComponent,
    IconButtonComponent,
  ],
  templateUrl: './offender-attachment-popup.component.html',
  styleUrls: ['./offender-attachment-popup.component.scss'],
})
export class OffenderAttachmentPopupComponent extends OnDestroyMixin(class {}) {
  data = inject(MAT_DIALOG_DATA);
  lang = inject(LangService);
  dialogRef = inject(MatDialogRef);
  dialog = inject(DialogService);

  model: Investigation = this.data && (this.data.model as Investigation);
  offenderId: number = this.data && (this.data.offenderId as number);
  readonly = this.data && this.data.readonly;

  constructor() {
    super();
  }
}
