import { AdminComponent } from '@abstracts/admin-component';
import { Component, inject } from '@angular/core';
import { AppIcons } from '@constants/app-icons';
import { ContextMenuActionContract } from '@contracts/context-menu-action-contract';
import { StatusTypes } from '@enums/status-types';
import { ColumnsWrapper } from '@models/columns-wrapper';
import { Lookup } from '@models/lookup';
import { NoneFilterColumn } from '@models/none-filter-column';
import { SelectFilterColumn } from '@models/select-filter-column';
import { Team } from '@models/team';
import { TextFilterColumn } from '@models/text-filter-column';
import { TeamPopupComponent } from '@modules/administration/popups/team-popup/team-popup.component';
import { LookupService } from '@services/lookup.service';
import { TeamService } from '@services/team.service';

@Component({
  selector: 'app-team',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.scss'],
})
export class TeamComponent extends AdminComponent<
  TeamPopupComponent,
  Team,
  TeamService
> {
  service = inject(TeamService);
  commonStatus: Lookup[] = inject(LookupService).lookups.commonStatus.filter(
    lookupItem => lookupItem.lookupKey !== StatusTypes.DELETED,
  );

  actions: ContextMenuActionContract<Team>[] = [
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
  ];

  columnsWrapper: ColumnsWrapper<Team> = new ColumnsWrapper(
    new NoneFilterColumn('select'),
    new TextFilterColumn('arName'),
    new TextFilterColumn('enName'),
    new SelectFilterColumn(
      'status',
      this.commonStatus,
      'lookupKey',
      'getNames',
    ),
    new NoneFilterColumn('actions'),
  ).attacheFilter(this.filter$);
}
