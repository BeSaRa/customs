import { Component, inject } from '@angular/core';
import { IconButtonComponent } from '@standalone/components/icon-button/icon-button.component';
import { MAT_DIALOG_DATA, MatDialogClose } from '@angular/material/dialog';
import { ButtonComponent } from '@standalone/components/button/button.component';
import { CrudDialogDataContract } from '@contracts/crud-dialog-data-contract';
import { InternalUserOU } from '@models/internal-user-ou';
import { ControlDirective } from '@standalone/directives/control.directive';
import { InputComponent } from '@standalone/components/input/input.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatTooltip } from '@angular/material/tooltip';
import { AdminComponent } from '@abstracts/admin-component';
import { UserTeamPopupComponent } from '@modules/administration/popups/user-team-popup/user-team-popup.component';
import { UserTeam } from '@models/user-team';
import { UserTeamService } from '@services/user-team.service';
import { ContextMenuActionContract } from '@contracts/context-menu-action-contract';
import { AppIcons } from '@constants/app-icons';
import { ColumnsWrapper } from '@models/columns-wrapper';
import { TextFilterColumn } from '@models/text-filter-column';
import { NoneFilterColumn } from '@models/none-filter-column';
import { AsyncPipe } from '@angular/common';
import { ContextMenuComponent } from '@standalone/components/context-menu/context-menu.component';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatNoDataRow,
  MatRow,
  MatRowDef,
  MatTable,
} from '@angular/material/table';
import {
  finalize,
  Observable,
  of,
  switchMap,
  tap,
  combineLatest,
  delay,
  map,
  takeUntil,
  exhaustMap,
  filter,
  Subject,
} from 'rxjs';
import { ignoreErrors } from '@utils/utils';
import { UserClick } from '@enums/user-click';

@Component({
  selector: 'app-internal-user-teams-popup',
  standalone: true,
  imports: [
    ButtonComponent,
    ControlDirective,
    IconButtonComponent,
    InputComponent,
    MatDialogClose,
    ReactiveFormsModule,
    AsyncPipe,
    ContextMenuComponent,
    MatCell,
    MatTooltip,
    MatTable,
    MatColumnDef,
    MatHeaderCell,
    MatHeaderCellDef,
    MatCellDef,
    MatHeaderRowDef,
    MatHeaderRow,
    MatRow,
    MatRowDef,
    MatNoDataRow,
  ],
  templateUrl: './internal-user-teams-popup.component.html',
  styleUrl: './internal-user-teams-popup.component.scss',
})
export class InternalUserTeamsPopupComponent extends AdminComponent<
  UserTeamPopupComponent,
  UserTeam,
  UserTeamService
> {
  data: CrudDialogDataContract<InternalUserOU> = inject(MAT_DIALOG_DATA);
  ouId = this.data.model.organizationUnitId;
  internalUserId = this.data.model.internalUserId;
  inViewMode: boolean = !!this.data.extras?.inViewMode;
  deleteWithOuId$: Subject<UserTeam> = new Subject<UserTeam>();
  override ngOnInit() {
    super.ngOnInit();
    this.listenToDelete();
  }

  service = inject(UserTeamService);
  columnsWrapper: ColumnsWrapper<UserTeam> = new ColumnsWrapper(
    new TextFilterColumn('teamName'),
    new NoneFilterColumn('actions'),
  );
  actions: ContextMenuActionContract<UserTeam>[] = [
    {
      name: 'delete',
      type: 'action',
      label: 'delete',
      disabled: this.inViewMode,
      icon: AppIcons.DELETE,
      callback: item => {
        this.deleteWithOuId$.next(item);
      },
    },
  ];
  override data$: Observable<UserTeam[]> = this._load();

  protected override _load(): Observable<UserTeam[]> {
    return of(undefined)
      .pipe(delay(0))
      .pipe(
        switchMap(() => {
          return combineLatest([this.reload$]).pipe(
            switchMap(() => {
              this.loadingSubject.next(true);
              return this.service
                .loadUserTeams(this.internalUserId, this.ouId, {})
                .pipe(
                  finalize(() => this.loadingSubject.next(false)),
                  ignoreErrors(),
                );
            }),
            tap(({ count }) => {
              this.length = count;
              this.loadingSubject.next(false);
            }),
            map(response => response.rs),
          );
        }),
      );
  }

  override _getCreateExtras(): {
    mappedUserTeamsIds: number[];
    internalUserId: number;
    ouId: number;
  } {
    return {
      mappedUserTeamsIds: this.dataSource.data.map(team => team.teamInfo.id),
      internalUserId: this.internalUserId,
      ouId: this.ouId,
    };
  }
  listenToDelete() {
    this.deleteWithOuId$
      .pipe(takeUntil(this.destroy$))
      .pipe(
        exhaustMap(model =>
          this.dialog
            .confirm(
              this.lang.map.msg_delete_confirm.change({
                x: model.getNames(),
              }),
            )
            .afterClosed()
            .pipe(filter(value => value === UserClick.YES))
            .pipe(
              switchMap(() => {
                this.loadingSubject.next(true);
                return this.service
                  .deleteWithOuId(model.id, this.ouId)
                  .pipe(
                    finalize(() => this.loadingSubject.next(false)),
                    ignoreErrors(),
                  )
                  .pipe(map(() => model));
              }),
            ),
        ),
      )
      .subscribe(model => {
        this.toast.success(
          this.lang.map.msg_delete_success.change({ x: model.getNames() }),
        );
        this.reload$.next();
      });
  }
}
