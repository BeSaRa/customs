import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CrudDialogDataContract } from '@contracts/crud-dialog-data-contract';
import { Localization } from '@models/localization';

@Component({
  selector: 'app-localization-popup',
  templateUrl: './localization-popup.component.html',
  styleUrls: ['./localization-popup.component.scss'],
})
export class LocalizationPopupComponent {
  private data: CrudDialogDataContract<Localization> = inject(MAT_DIALOG_DATA);
}
