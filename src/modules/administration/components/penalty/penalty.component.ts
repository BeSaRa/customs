import { Component, inject } from '@angular/core';
import { AdminComponent } from '@abstracts/admin-component';
import { Penalty } from '@models/penalty';
import { PenaltyService } from '@services/penalty.service';
import { PenaltyPopupComponent } from '@modules/administration/popups/penalty-popup/penalty-popup.component';
import { ContextMenuActionContract } from '@contracts/context-menu-action-contract';
import { AppIcons } from '@constants/app-icons';
import { ColumnsWrapper } from '@models/columns-wrapper';
import { NoneFilterColumn } from '@models/none-filter-column';
import { TextFilterColumn } from '@models/text-filter-column';
import { SelectFilterColumn } from '@models/select-filter-column';
import { Lookup } from '@models/lookup';
import { StatusTypes } from '@enums/status-types';

@Component({
  selector: 'app-penalty',
  templateUrl: './penalty.component.html',
  styleUrls: ['./penalty.component.scss'],
})
export class PenaltyComponent extends AdminComponent<PenaltyPopupComponent, Penalty, PenaltyService> {
  service = inject(PenaltyService);

  commonStatus: Lookup[] = this.lookupService.lookups.commonStatus.filter(s => s.lookupKey != StatusTypes.DELETED);
  offenderTypes: Lookup[] = this.lookupService.lookups.offenderType;

  actions: ContextMenuActionContract<Penalty>[] = [
    {
      name: 'view',
      type: 'action',
      label: 'view',
      icon: AppIcons.VIEW,
      callback: item => {
        this.view$.next(item);
      },
    },
    {
      name: 'edit',
      type: 'action',
      label: 'edit',
      icon: AppIcons.EDIT,
      callback: item => {
        this.edit$.next(item);
      },
    },
    {
      name: 'audit',
      type: 'action',
      label: 'audit',
      icon: AppIcons.HISTORY,
      callback: item => {
        this.viewAudit$.next(item);
      },
    },
    {
      name: 'delete',
      type: 'action',
      label: 'delete',
      icon: AppIcons.DELETE,
      callback: item => {
        this.delete$.next(item);
      },
    },
  ];
  // here we have a new implementation for displayed/filter Columns for the table
  columnsWrapper: ColumnsWrapper<Penalty> = new ColumnsWrapper(
    new NoneFilterColumn('select'),
    new TextFilterColumn('arName'),
    new TextFilterColumn('enName'),
    new SelectFilterColumn('offenderType', this.offenderTypes, 'lookupKey', 'getNames'),
    new TextFilterColumn('erasureDuration'),
    new SelectFilterColumn('status', this.commonStatus, 'lookupKey', 'getNames'),
    new NoneFilterColumn('actions')
  ).attacheFilter(this.filter$);
}
