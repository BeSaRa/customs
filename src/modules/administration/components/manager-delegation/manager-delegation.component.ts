import { Component, inject, OnInit } from '@angular/core';
import { AdminComponent } from '@abstracts/admin-component';
import { ManagerDelegation } from '@models/manager-delegation';
import { ManagerDelegationService } from '@services/manager-delegation.service';
import { ManagerDelegationPopupComponent } from '@modules/administration/popups/manager-delegation-popup/manager-delegation-popup.component';
import { ContextMenuActionContract } from '@contracts/context-menu-action-contract';
import { AppIcons } from '@constants/app-icons';
import { ColumnsWrapper } from '@models/columns-wrapper';
import { NoneFilterColumn } from '@models/none-filter-column';
import { ConfigService } from '@services/config.service';
import { SelectFilterColumn } from '@models/select-filter-column';
import { InternalUserService } from '@services/internal-user.service';
import { MawaredDepartmentService } from '@services/mawared-department.service';
import { Subject, switchMap } from 'rxjs';
import { ViewAttachmentPopupComponent } from '@standalone/popups/view-attachment-popup/view-attachment-popup.component';
import { BlobModel } from '@models/blob-model';
import { InvestigationService } from '@services/investigation.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-manager-delegation',
  templateUrl: './manager-delegation.component.html',
  styleUrls: ['./manager-delegation.component.scss'],
})
export class ManagerDelegationComponent
  extends AdminComponent<
    ManagerDelegationPopupComponent,
    ManagerDelegation,
    ManagerDelegationService
  >
  implements OnInit
{
  override ngOnInit() {
    super.ngOnInit();
    this.listenToViewDecisionFile();
  }

  investigationService = inject(InvestigationService);
  viewDecisionFile$ = new Subject<string>();
  domSanitize = inject(DomSanitizer);
  config = inject(ConfigService);
  service = inject(ManagerDelegationService);
  internalUserService = inject(InternalUserService);
  mawaredDepartmentService = inject(MawaredDepartmentService);
  actions: ContextMenuActionContract<ManagerDelegation>[] = [
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
  columnsWrapper: ColumnsWrapper<ManagerDelegation> = new ColumnsWrapper(
    new NoneFilterColumn('select'),
    new SelectFilterColumn(
      'delegatedId',
      this.internalUserService.loadAsLookups(),
      'id',
      'getNames',
    ),
    new SelectFilterColumn(
      'departmentId',
      this.mawaredDepartmentService.loadAsLookups(),
      'id',
      'getNames',
    ),
    new SelectFilterColumn(
      'type',
      this.lookupService.lookups.DelegationType,
      'lookupKey',
      'getNames',
    ),
    new NoneFilterColumn('actions'),
  ).attacheFilter(this.filter$);

  private listenToViewDecisionFile() {
    this.viewDecisionFile$
      .pipe(
        switchMap(delegationVsId => {
          return this.investigationService.getDecisionFileAttachments(
            delegationVsId,
          );
        }),
      )
      .pipe(
        switchMap(model => {
          return this.dialog
            .open(ViewAttachmentPopupComponent, {
              data: {
                model: new BlobModel(
                  model.content as unknown as Blob,
                  this.domSanitize,
                ),
                title: model.documentTitle,
              },
            })
            .afterClosed();
        }),
      )
      .subscribe();
  }
}
