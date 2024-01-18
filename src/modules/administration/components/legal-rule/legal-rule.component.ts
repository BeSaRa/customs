import { Component, inject } from '@angular/core';
import { AdminComponent } from '@abstracts/admin-component';
import { LegalRule } from '@models/legal-rule';
import { LegalRuleService } from '@services/legal-rule.service';
import { LegalRulePopupComponent } from '@modules/administration/popups/legal-rule-popup/legal-rule-popup.component';
import { ContextMenuActionContract } from '@contracts/context-menu-action-contract';
import { AppIcons } from '@constants/app-icons';
import { ColumnsWrapper } from '@models/columns-wrapper';
import { TextFilterColumn } from '@models/text-filter-column';
import { NoneFilterColumn } from '@models/none-filter-column';
import { SelectFilterColumn } from '@models/select-filter-column';
import { StatusTypes } from '@enums/status-types';

@Component({
  selector: 'app-legal-rule',
  templateUrl: './legal-rule.component.html',
  styleUrls: ['./legal-rule.component.scss'],
})
export class LegalRuleComponent extends AdminComponent<
  LegalRulePopupComponent,
  LegalRule,
  LegalRuleService
> {
  service = inject(LegalRuleService);
  actions: ContextMenuActionContract<LegalRule>[] = [
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
    {
      name: 'more-details',
      type: 'info',
      label: 'more_details',
      icon: AppIcons.MORE_DETAILS,
    },
    {
      name: 'law-start-date',
      type: 'info',
      label: item => `${this.lang.map.law_start_date} : ${item.lawStartDate}`,
      parent: 'more-details',
    },
    {
      name: 'article-number',
      type: 'info',
      label: item => `${this.lang.map.article_number} : ${item.articleNumber}`,
      parent: 'more-details',
    },
  ];
  // here we have a new implementation for displayed/filter Columns for the table
  columnsWrapper: ColumnsWrapper<LegalRule> = new ColumnsWrapper(
    new NoneFilterColumn('select'),
    new TextFilterColumn('arName'),
    new TextFilterColumn('enName'),
    new TextFilterColumn('law'),
    new TextFilterColumn('legalTextArabic'),
    new TextFilterColumn('legalTextEnglish'),
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
