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
  displayedColumns: string[] = [
    'select',
    'arName',
    'enName',
    'penaltyType',
    'violationClassificationId',
    'actions',
  ];
  filterColumns: string[] = [
    'filterArName',
    'filterEnName',
    'filterPenaltyType',
    'filterClassification',
  ];

  langCode = this.lang.getCurrent().code;
  isArabic = this.langCode === LangCodes.AR;
  types = inject(LookupService).lookups.penaltyType;
  violationClassificationService = inject(ViolationClassificationService);
  classifications!: any[];
  override ngOnInit(): void {
    super.ngOnInit();
    this.violationClassificationService.loadAsLookups().subscribe((data) => {
      this.classifications = data;
    });
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
}
