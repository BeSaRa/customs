import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { LangService } from '@services/lang.service';
import { ButtonComponent } from '@standalone/components/button/button.component';
import { InputComponent } from '../../components/input/input.component';
import { CaseAttachment } from '@models/case-attachment';
import { BaseCaseService } from '@abstracts/base-case.service';
import { CustomValidators } from '@validators/custom-validators';
import { IconButtonComponent } from '@standalone/components/icon-button/icon-button.component';
import { take } from 'rxjs';
import { ToastService } from '@services/toast.service';

@Component({
  selector: 'app-edit-attachment-name-popup',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonComponent,
    MatDialogModule,
    InputComponent,
    IconButtonComponent,
  ],
  templateUrl: './edit-attachment-name-popup.component.html',
  styleUrl: './edit-attachment-name-popup.component.scss',
})
export class EditAttachmentNamePopupComponent {
  lang = inject(LangService);
  data = inject<{
    attachment: CaseAttachment;
    service: BaseCaseService<unknown>;
    isExternal: boolean;
  }>(MAT_DIALOG_DATA);
  dialogRef = inject(MatDialogRef);
  toast = inject(ToastService);

  title = new FormControl(this._getInitialTitle(), [CustomValidators.required]);

  private _getInitialTitle() {
    const _index = this.data.attachment.documentTitle.lastIndexOf('.');
    return this.data.attachment.documentTitle.slice(0, _index);
  }

  private _getSuffix() {
    const _index = this.data.attachment.documentTitle.lastIndexOf('.');
    return this.data.attachment.documentTitle.slice(_index);
  }

  save() {
    this.data.attachment
      .updateAttachmentTitle(
        this.data.service,
        (this.title.value ?? '') + this._getSuffix(),
        this.data.isExternal,
      )
      .pipe(take(1))
      .subscribe(() => {
        this.toast.success(this.lang.map.attachment_title_updated_successfully);
        this.dialogRef.close();
      });
  }
}
