import { Component, inject } from '@angular/core';
import { ButtonComponent } from '@standalone/components/button/button.component';
import { IconButtonComponent } from '@standalone/components/icon-button/icon-button.component';
import { InputComponent } from '@standalone/components/input/input.component';
import { MAT_DIALOG_DATA, MatDialogClose } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { ReactiveFormsModule } from '@angular/forms';
import { TextareaComponent } from '@standalone/components/textarea/textarea.component';
import { LangService } from '@services/lang.service';

@Component({
  selector: 'app-investigation-file-details-for-external-user-popup',
  standalone: true,
  imports: [
    ButtonComponent,
    IconButtonComponent,
    InputComponent,
    MatDialogClose,
    MatIcon,
    ReactiveFormsModule,
    TextareaComponent,
  ],
  templateUrl:
    './investigation-file-details-for-external-user-popup.component.html',
  styleUrl:
    './investigation-file-details-for-external-user-popup.component.scss',
})
export class InvestigationFileDetailsForExternalUserPopupComponent {
  lang = inject(LangService);
  data = inject(MAT_DIALOG_DATA);
  model = this.data.model;
}
