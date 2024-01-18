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
import { SelectFilterColumn } from '@models/select-filter-column';
import { StatusTypes } from '@enums/status-types';
import { ViolationTypeService } from '@services/violation-type.service';
import { PenaltyService } from '@services/penalty.service';

@Component({
  selector: 'app-violation-penalty',
  templateUrl: './violation-penalty.component.html',
  styleUrls: ['./violation-penalty.component.scss'],
})
export class ViolationPenaltyComponent extends AdminComponent<
  ViolationPenaltyPopupComponent,
  ViolationPenalty,
  ViolationPenaltyService
> {
  service = inject(ViolationPenaltyService);
  penaltyService = inject(PenaltyService);
  violationTypeService = inject(ViolationTypeService);
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
    new SelectFilterColumn(
      'violationType',
      this.violationTypeService.loadAsLookups(),
      'id',
      'getNames',
    ),
    new SelectFilterColumn(
      'offenderType',
      this.lookupService.lookups.offenderType,
      'lookupKey',
      'getNames',
    ),
    new TextFilterColumn('repeat'),
    new SelectFilterColumn(
      'offenderLevel',
      this.lookupService.lookups.offenderLevel,
      'lookupKey',
      'getNames',
    ),
    new SelectFilterColumn(
      'penalty',
      this.penaltyService.loadAsLookups(),
      'id',
      'getNames',
    ),
    new SelectFilterColumn(
      'penaltySigner',
      this.lookupService.lookups.penaltySigner,
      'lookupKey',
      'getNames',
    ),
    new SelectFilterColumn(
      'penaltyGuidance',
      this.lookupService.lookups.penaltyGuidance,
      'lookupKey',
      'getNames',
    ),
    new SelectFilterColumn(
      'status',
      this.lookupService.lookups.commonStatus.filter(
        item => item.lookupKey !== StatusTypes.DELETED,
      ),
      'lookupKey',
      'getNames',
    ),
    new NoneFilterColumn('actions'),
  ).attacheFilter(this.filter$);
}
