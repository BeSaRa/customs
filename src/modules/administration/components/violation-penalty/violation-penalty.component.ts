import { Component, inject, input } from '@angular/core';
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
import { ViolationTypeService } from '@services/violation-type.service';
import { PenaltyService } from '@services/penalty.service';
import { UserClick } from '@enums/user-click';
import { filter, finalize, switchMap } from 'rxjs';
import { ignoreErrors } from '@utils/utils';

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
  violationType = input.required<number>();
  offenderType = input.required<number>();
  inEditMode = input.required<boolean>();
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
  ];
  editModeActions: ContextMenuActionContract<ViolationPenalty>[] = [
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
      'offenderLevel',
      this.lookupService.lookups.offenderLevel,
      'lookupKey',
      'getNames',
    ),
    new TextFilterColumn('repeat'),
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
    new NoneFilterColumn('actions'),
  ).attacheFilter(this.filter$);

  override ngOnInit() {
    super.ngOnInit();
    if (this.inEditMode()) {
      this.actions.push(...this.editModeActions);
    }
    this.filter$.next({ violationTypeId: this.violationType() });
  }

  override _getCreateExtras() {
    return {
      violationType: this.violationType(),
      offenderType: this.offenderType(),
    };
  }

  override _getEditExtras() {
    return {
      violationType: this.violationType(),
      offenderType: this.offenderType(),
    };
  }

  override _getViewExtras(): unknown {
    return {
      violationType: this.violationType(),
      offenderType: this.offenderType(),
    };
  }

  deleteBulk(): void {
    if (this.selection.selected.length > 0) {
      this.dialog
        .confirm(this.lang.map.msg_delete_selected_confirm)
        .afterClosed()
        .pipe(filter(value => value === UserClick.YES))
        .pipe(
          switchMap(() => {
            this.loadingSubject.next(true);
            const ids = this.selection.selected.map(
              (item: ViolationPenalty) => {
                return item.id;
              },
            );
            return this.service.deleteBulk(ids).pipe(
              finalize(() => this.loadingSubject.next(false)),
              ignoreErrors(),
            );
          }),
        )
        .subscribe(() => {
          this.toast.success(this.lang.map.msg_delete_selected_success);
          this.reload$.next();
        });
    }
  }
}
