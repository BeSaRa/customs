import { Component, inject } from '@angular/core';
import { AdminComponent } from '@abstracts/admin-component';
import { Localization } from '@models/localization';
import { LocalizationService } from '@services/localization.service';
import { LocalizationPopupComponent } from '@modules/administration/popups/localization-popup/localization-popup.component';
import { ContextMenuActionContract } from '@contracts/context-menu-action-contract';
import { AppIcons } from '@constants/app-icons';
import { ColumnsWrapper } from '@models/columns-wrapper';
import { TextFilterColumn } from '@models/text-filter-column';
import { NoneFilterColumn } from '@models/none-filter-column';

@Component({
  selector: 'app-localization',
  templateUrl: './localization.component.html',
  styleUrls: ['./localization.component.scss'],
})
export class LocalizationComponent
  extends AdminComponent<
    LocalizationPopupComponent,
    Localization,
    LocalizationService
  >
{
  service = inject(LocalizationService);
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
  // here we have a new implementation for displayed/filter Columns for the table
  columnsWrapper: ColumnsWrapper<Localization> = new ColumnsWrapper(
    new NoneFilterColumn('select'),
    new TextFilterColumn('localizationKey'),
    new TextFilterColumn('arName'),
    new TextFilterColumn('enName'),
    new NoneFilterColumn('actions')
  ).attacheFilter(this.filter$);
}
