import { Component, inject } from '@angular/core';
import { AdminComponent } from '@abstracts/admin-component';
import { Localization } from '@models/localization';
import { LocalizationService } from '@services/localization.service';
import { LocalizationPopupComponent } from '@modules/administration/popups/localization-popup/localization-popup.component';

@Component({
  selector: 'app-localization',
  templateUrl: './localization.component.html',
  styleUrls: ['./localization.component.scss'],
})
export class LocalizationComponent extends AdminComponent<
  LocalizationPopupComponent,
  Localization,
  LocalizationService
> {
  service = inject(LocalizationService);
  displayedColumns: string[] = [
    'select',
    'localizationKey',
    'arName',
    'enName',
    'actions',
  ];
}
