import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogClose } from '@angular/material/dialog';
import { LangService } from '@services/lang.service';
import { ButtonComponent } from '@standalone/components/button/button.component';
import { IconButtonComponent } from '@standalone/components/icon-button/icon-button.component';
import { CaseAttachmentsComponent } from '@standalone/components/case-attachments/case-attachments.component';
import { FolderType } from '@enums/folder-type.enum';
import { GrievanceService } from '@services/grievance.service';

@Component({
  selector: 'app-grievance-attachments-popup',
  standalone: true,
  imports: [
    MatDialogClose,
    ButtonComponent,
    IconButtonComponent,
    CaseAttachmentsComponent,
  ],
  templateUrl: './grievance-attachments-popup.component.html',
  styleUrl: './grievance-attachments-popup.component.scss',
})
export class GrievanceAttachmentsPopupComponent {
  lang = inject(LangService);
  service = inject(GrievanceService);
  data = inject(MAT_DIALOG_DATA);
  model = this.data.model;
  protected readonly FolderType = FolderType;
}
