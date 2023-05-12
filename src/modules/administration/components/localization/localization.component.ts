import { AfterViewInit, Component, inject, ViewChild } from '@angular/core';
import { AdminComponent } from '@abstracts/admin-component';
import { Localization } from '@models/localization';
import { LocalizationService } from '@services/localization.service';
import { LocalizationPopupComponent } from '@modules/administration/popups/localization-popup/localization-popup.component';
import { ContextMenuActionContract } from '@contracts/context-menu-action-contract';
import { AppIcons } from '@constants/app-icons';
import { MatMenuTrigger } from '@angular/material/menu';

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
  actions: ContextMenuActionContract<Localization>[] = [
    {
      name: 'view',
      type: 'action',
      label: 'view',
      icon: AppIcons.VIEW,
      callback: (item) => {
        this.view$.next(item);
      },
    },
    {
      name: 'edit',
      type: 'action',
      label: 'edit',
      icon: AppIcons.EDIT,
      callback: (item) => {
        this.edit$.next(item);
      },
    },
    {
      name: 'delete',
      type: 'action',
      label: 'delete',
      icon: AppIcons.DELETE,
      callback: (item) => {
        this.delete$.next(item);
      },
    },
  ];
}
