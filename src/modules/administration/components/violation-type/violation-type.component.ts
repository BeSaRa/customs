import { Component, inject, ViewChild } from '@angular/core';
import { AdminComponent } from '@abstracts/admin-component';
import { ViolationType } from '@models/violation-type';
import { ViolationTypeService } from '@services/violation-type.service';
import { ViolationTypePopupComponent } from '@modules/administration/popups/violation-type-popup/violation-type-popup.component';
import { LangCodes } from '@enums/lang-codes';
import { LookupService } from '@services/lookup.service';
import { ViolationClassificationService } from '@services/violation-classification.service';
import { AppIcons } from '@constants/app-icons';
import { MatMenuTrigger } from '@angular/material/menu';
import { ContextMenuActionContract } from '@contracts/context-menu-action-contract';
import { ColumnsWrapper } from '@models/columns-wrapper';
import { NoneFilterColumn } from '@models/none-filter-column';
import { TextFilterColumn } from '@models/text-filter-column';
import { SelectFilterColumn } from '@models/select-filter-column';

@Component({
  selector: 'app-violation-type',
  templateUrl: './violation-type.component.html',
  styleUrls: ['./violation-type.component.scss'],
})
export class ViolationTypeComponent extends AdminComponent<
  ViolationTypePopupComponent,
  ViolationType,
  ViolationTypeService
> {
  service = inject(ViolationTypeService);

  langCode = this.lang.getCurrent().code;
  types = inject(LookupService).lookups.penaltyType;
  violationClassificationService = inject(ViolationClassificationService);
  columnsWrapper: ColumnsWrapper<ViolationType> = new ColumnsWrapper(
    new NoneFilterColumn('select')
  ).attacheFilter(this.filter$);
  classifications!: any[];
  override ngOnInit(): void {
    super.ngOnInit();
    this._getViolationClassifications();
  }
  actions: ContextMenuActionContract<ViolationType>[] = [
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
  protected _getViolationClassifications() {
    this.violationClassificationService.loadAsLookups().subscribe((data) => {
      this.classifications = data;
      this.columnsWrapper = new ColumnsWrapper(
        new NoneFilterColumn('select'),
        new TextFilterColumn('arName'),
        new TextFilterColumn('enName'),
        new SelectFilterColumn(
          'penaltyType',
          this.types,
          'lookupKey',
          this.getDisplayName()
        ),
        new SelectFilterColumn(
          'violationClassificationId',
          this.classifications,
          'id',
          this.getDisplayName()
        ),
        new NoneFilterColumn('actions')
      ).attacheFilter(this.filter$);
    });
  }
}
