import { Component, inject } from '@angular/core';
import { AdminComponent } from '@abstracts/admin-component';
import { ClearingAgent } from '@models/clearing-agent';
import { ClearingAgentService } from '@services/clearing-agent.service';
import { ClearingAgentPopupComponent } from '@modules/administration/popups/clearing-agent-popup/clearing-agent-popup.component';
import { ContextMenuActionContract } from '@contracts/context-menu-action-contract';
import { AppIcons } from '@constants/app-icons';
import { ColumnsWrapper } from '@models/columns-wrapper';
import { TextFilterColumn } from '@models/text-filter-column';
import { NoneFilterColumn } from '@models/none-filter-column';
import { SelectFilterColumn } from '@models/select-filter-column';
import { Lookup } from '@models/lookup';
import { StatusTypes } from '@enums/status-types';

@Component({
  selector: 'app-clearing-agent',
  templateUrl: './clearing-agent.component.html',
  styleUrls: ['./clearing-agent.component.scss'],
})
export class ClearingAgentComponent extends AdminComponent<ClearingAgentPopupComponent, ClearingAgent, ClearingAgentService> {
  service = inject(ClearingAgentService);
  commonStatus: Lookup[] = this.lookupService.lookups.commonStatus.filter(s => s.lookupKey != StatusTypes.DELETED);
  actions: ContextMenuActionContract<ClearingAgent>[] = [
    {
      name: 'view',
      type: 'action',
      label: 'view',
      icon: AppIcons.VIEW,
      callback: item => {
        this.view$.next(item);
      },
    },
  ];
  // here we have a new implementation for displayed/filter Columns for the table
  columnsWrapper: ColumnsWrapper<ClearingAgent> = new ColumnsWrapper(
    new NoneFilterColumn('select'),
    new TextFilterColumn('enName'),
    new TextFilterColumn('arName'),
    new TextFilterColumn('qid'),
    new SelectFilterColumn('status', this.commonStatus, 'lookupKey', 'getNames'),
    new NoneFilterColumn('actions')
  ).attacheFilter(this.filter$);
}
