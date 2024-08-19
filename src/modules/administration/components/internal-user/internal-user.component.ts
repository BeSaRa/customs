import { Component, inject, OnInit } from '@angular/core';
import { AdminComponent } from '@abstracts/admin-component';
import { InternalUser } from '@models/internal-user';
import { InternalUserService } from '@services/internal-user.service';
import { InternalUserPopupComponent } from '@modules/administration/popups/internal-user-popup/internal-user-popup.component';
import { ContextMenuActionContract } from '@contracts/context-menu-action-contract';
import { AppIcons } from '@constants/app-icons';
import { ColumnsWrapper } from '@models/columns-wrapper';
import { NoneFilterColumn } from '@models/none-filter-column';
import { TextFilterColumn } from '@models/text-filter-column';
import { StatusTypes } from '@enums/status-types';
import { SelectFilterColumn } from '@models/select-filter-column';
import { Lookup } from '@models/lookup';
import { takeUntil } from 'rxjs';
import { LangCodes } from '@enums/lang-codes';

@Component({
  selector: 'app-internal-user',
  templateUrl: './internal-user.component.html',
  styleUrls: ['./internal-user.component.scss'],
})
export class InternalUserComponent
  extends AdminComponent<
    InternalUserPopupComponent,
    InternalUser,
    InternalUserService
  >
  implements OnInit
{
  service = inject(InternalUserService);
  commonStatus: Lookup[] = this.lookupService.lookups.commonStatus.filter(
    s => s.lookupKey !== StatusTypes.DELETED,
  );

  actions: ContextMenuActionContract<InternalUser>[] = [
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
      name: 'more-details',
      type: 'info',
      label: 'more_details',
      icon: AppIcons.MORE_DETAILS,
    },
    {
      name: 'email',
      type: 'info',
      label: item => `${this.lang.map.email} : ${item.email}`,
      parent: 'more-details',
    },
    {
      name: 'job-title-info',
      type: 'info',
      label: item =>
        `${this.lang.map.menu_job_title} : ${item.jobTitleInfo?.getNames() || ''}`,
      parent: 'more-details',
    },
    {
      name: 'phone-number',
      type: 'info',
      label: item => `${this.lang.map.phone_number} : ${item.phoneNumber}`,
      parent: 'more-details',
    },
  ];

  override columnsWrapper!: ColumnsWrapper<InternalUser>;

  override ngOnInit() {
    super.ngOnInit();
    this.updateColumns(this.lang.getCurrent().code);
    this.lang.change$.pipe(takeUntil(this.destroy$)).subscribe(langContract => {
      this.updateColumns(langContract.code);
    });
  }

  updateColumns(langCode: LangCodes) {
    if (langCode === LangCodes.AR) {
      this.columnsWrapper = new ColumnsWrapper(
        new NoneFilterColumn('select'),
        new TextFilterColumn('arName'),
        new TextFilterColumn('domainName'),
        new TextFilterColumn('qid'),
        new TextFilterColumn('empNum'),
        new SelectFilterColumn(
          'status',
          this.commonStatus,
          'lookupKey',
          'getNames',
        ),
        new NoneFilterColumn('actions'),
      ).attacheFilter(this.filter$);
    } else {
      this.columnsWrapper = new ColumnsWrapper(
        new NoneFilterColumn('select'),
        new TextFilterColumn('enName'),
        new TextFilterColumn('domainName'),
        new TextFilterColumn('qid'),
        new TextFilterColumn('empNum'),
        new SelectFilterColumn(
          'status',
          this.commonStatus,
          'lookupKey',
          'getNames',
        ),
        new NoneFilterColumn('actions'),
      ).attacheFilter(this.filter$);
    }
  }
}
