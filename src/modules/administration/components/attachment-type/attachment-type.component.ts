import { Component, inject } from '@angular/core';
import { AdminComponent } from '@abstracts/admin-component';
import { AttachmentType } from '@models/attachment-type';
import { AttachmentTypeService } from '@services/attachment-type.service';
import { AttachmentTypePopupComponent } from '@modules/administration/popups/attachment-type-popup/attachment-type-popup.component';
import { ContextMenuActionContract } from '@contracts/context-menu-action-contract';
import { AppIcons } from '@constants/app-icons';
import { ColumnsWrapper } from '@models/columns-wrapper';
import { TextFilterColumn } from '@models/text-filter-column';
import { NoneFilterColumn } from '@models/none-filter-column';

@Component({
  selector: 'app-attachment-type',
  templateUrl: './attachment-type.component.html',
  styleUrls: ['./attachment-type.component.scss'],
})
export class AttachmentTypeComponent extends AdminComponent<AttachmentTypePopupComponent, AttachmentType, AttachmentTypeService> {
  service = inject(AttachmentTypeService);
  actions: ContextMenuActionContract<AttachmentType>[] = [
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
  columnsWrapper: ColumnsWrapper<AttachmentType> = new ColumnsWrapper(
    new NoneFilterColumn('select'),
    new TextFilterColumn('arName'),
    new NoneFilterColumn('actions')
  ).attacheFilter(this.filter$);
}
