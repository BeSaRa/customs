import { Component, inject, OnDestroy } from '@angular/core';

import { ButtonComponent } from '@standalone/components/button/button.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IconButtonComponent } from '@standalone/components/icon-button/icon-button.component';
import { InputComponent } from '@standalone/components/input/input.component';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { SelectInputComponent } from '@standalone/components/select-input/select-input.component';
import { SwitchComponent } from '@standalone/components/switch/switch.component';
import { LangService } from '@services/lang.service';
import { BlobModel } from '@models/blob-model';

@Component({
  selector: 'app-view-attachment-popup',
  standalone: true,
  imports: [
    ButtonComponent,
    FormsModule,
    IconButtonComponent,
    InputComponent,
    MatDialogModule,
    ReactiveFormsModule,
    SelectInputComponent,
    SwitchComponent,
  ],
  templateUrl: './view-attachment-popup.component.html',
  styleUrls: ['./view-attachment-popup.component.scss'],
})
export class ViewAttachmentPopupComponent implements OnDestroy {
  lang = inject(LangService);
  data: { title: string; model: BlobModel } = inject(MAT_DIALOG_DATA);

  ngOnDestroy(): void {
    this.data.model.dispose();
  }
}
