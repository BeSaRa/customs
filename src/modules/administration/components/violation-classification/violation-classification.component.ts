import { Component, ViewChild, inject } from '@angular/core';
import { AdminComponent } from '@abstracts/admin-component';
import { ViolationClassification } from '@models/violation-classification';
import { ViolationClassificationService } from '@services/violation-classification.service';
import { ViolationClassificationPopupComponent } from '@modules/administration/popups/violation-classification-popup/violation-classification-popup.component';
import { LookupService } from '@services/lookup.service';
import { LangService } from '@services/lang.service';
import { LangCodes } from '@enums/lang-codes';
import { LookupMapContract } from '@contracts/lookup-map-contract';
import { Lookup } from '@models/lookup';
import { AppIcons } from '@constants/app-icons';
import { ContextMenuActionContract } from '@contracts/context-menu-action-contract';
import { MatMenuTrigger } from '@angular/material/menu';

@Component({
  selector: 'app-violation-classification',
  templateUrl: './violation-classification.component.html',
  styleUrls: ['./violation-classification.component.scss'],
})
export class ViolationClassificationComponent extends AdminComponent<
  ViolationClassificationPopupComponent,
  ViolationClassification,
  ViolationClassificationService
> {
  service = inject(ViolationClassificationService);
  displayedColumns: string[] = [
    'select',
    'arName',
    'enName',
    'penaltyType',
    'actions',
  ];
  langCode = this.lang.getCurrent().code;
  isArabic = this.langCode === LangCodes.AR;
  types = inject(LookupService).lookups.penaltyType;
  actions: ContextMenuActionContract<ViolationClassification>[] = [
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
