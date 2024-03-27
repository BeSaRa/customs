import { Component, inject } from '@angular/core';
import { ButtonComponent } from '@standalone/components/button/button.component';
import { FormsModule } from '@angular/forms';
import { IconButtonComponent } from '@standalone/components/icon-button/icon-button.component';
import { InputComponent } from '@standalone/components/input/input.component';
import { MAT_DIALOG_DATA, MatDialogClose } from '@angular/material/dialog';
import { LangService } from '@services/lang.service';
import { CrudDialogDataContract } from '@contracts/crud-dialog-data-contract';
import { Meeting } from '@models/meeting';

@Component({
  selector: 'app-meeting-details-popup',
  standalone: true,
  imports: [
    ButtonComponent,
    FormsModule,
    IconButtonComponent,
    InputComponent,
    MatDialogClose,
  ],
  templateUrl: './meeting-details-popup.component.html',
  styleUrl: './meeting-details-popup.component.scss',
})
export class MeetingDetailsPopupComponent {
  lang = inject(LangService);
  data: CrudDialogDataContract<Meeting> = inject(MAT_DIALOG_DATA);
}
