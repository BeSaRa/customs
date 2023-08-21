import { Component, inject } from '@angular/core';
import { AdminComponent } from '@abstracts/admin-component';
import { ViolationPenalty } from '@models/violation-penalty';
import { ViolationPenaltyService } from '@services/violation-penalty.service';
import { ViolationPenaltyPopupComponent } from '@modules/administration/popups/violation-penalty-popup/violation-penalty-popup.component';
import { ContextMenuActionContract } from '@contracts/context-menu-action-contract';
import { AppIcons } from '@constants/app-icons';
import { ColumnsWrapper } from '@models/columns-wrapper';
import { TextFilterColumn } from '@models/text-filter-column';
import { NoneFilterColumn } from '@models/none-filter-column';

@Component({
  selector: 'app-violation-penalty',
  templateUrl: './violation-penalty.component.html',
  styleUrls: ['./violation-penalty.component.scss'],
})
export class ViolationPenaltyComponent extends AdminComponent<ViolationPenaltyPopupComponent, ViolationPenalty, ViolationPenaltyService> {
  service = inject(ViolationPenaltyService);
  actions: ContextMenuActionContract<ViolationPenalty>[] = [
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
  columnsWrapper: ColumnsWrapper<ViolationPenalty> = new ColumnsWrapper(
    new NoneFilterColumn('select'),
    new TextFilterColumn('arName'),
    new TextFilterColumn('enName'),
    new TextFilterColumn('repeat'),
    new TextFilterColumn('violationTypeInfo'),
    new TextFilterColumn('offenderType'),
    new TextFilterColumn('offenderLevelInfo'),
    new TextFilterColumn('penaltyInfo'),
    new TextFilterColumn('penaltySignerInfo'),
    new TextFilterColumn('penaltyGuidanceInfo'),
    new NoneFilterColumn('actions')
  ).attacheFilter(this.filter$);
}