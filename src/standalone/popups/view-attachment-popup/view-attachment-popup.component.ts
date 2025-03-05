import { Component, inject, OnDestroy, OnInit } from '@angular/core';

import { ButtonComponent } from '@standalone/components/button/button.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IconButtonComponent } from '@standalone/components/icon-button/icon-button.component';
import { InputComponent } from '@standalone/components/input/input.component';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { SelectInputComponent } from '@standalone/components/select-input/select-input.component';
import { SwitchComponent } from '@standalone/components/switch/switch.component';
import { LangService } from '@services/lang.service';
import { BlobModel } from '@models/blob-model';
import { MatTooltip } from '@angular/material/tooltip';

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
    MatTooltip,
  ],
  templateUrl: './view-attachment-popup.component.html',
  styleUrls: ['./view-attachment-popup.component.scss'],
})
export class ViewAttachmentPopupComponent implements OnDestroy, OnInit {
  lang = inject(LangService);
  data: { title: string; model: BlobModel; mimeType: string } =
    inject(MAT_DIALOG_DATA);
  dialogRef = inject(MatDialogRef<ViewAttachmentPopupComponent>);
  isFullScreen = true;
  isPdf = true;
  ngOnDestroy(): void {
    this.data.model.dispose();
  }
  ngOnInit(): void {
    this.isPdf =
      !this.data.mimeType || this.data.mimeType === 'application/pdf';
  }
  toggleSize() {
    this.isFullScreen = !this.isFullScreen;

    this.dialogRef.updateSize(
      this.isFullScreen ? '100vw' : '800px',
      this.isFullScreen ? '100vh' : '800px',
    );

    this.dialogRef.updatePosition({
      top: this.isFullScreen ? '0' : 'calc(50vh - 400px)',
      left: this.isFullScreen ? '0' : 'calc(50vw - 400px)',
    });
  }
}
