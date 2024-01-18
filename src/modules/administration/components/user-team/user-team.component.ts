import { Component, Input, inject } from '@angular/core';
import { AdminComponent } from '@abstracts/admin-component';
import { UserTeam } from '@models/user-team';
import { UserTeamService } from '@services/user-team.service';
import { UserTeamPopupComponent } from '@modules/administration/popups/user-team-popup/user-team-popup.component';
import { ContextMenuActionContract } from '@contracts/context-menu-action-contract';
import { AppIcons } from '@constants/app-icons';
import { ColumnsWrapper } from '@models/columns-wrapper';
import { TextFilterColumn } from '@models/text-filter-column';
import { NoneFilterColumn } from '@models/none-filter-column';
import { InternalUser } from '@models/internal-user';
import {
  Observable,
  combineLatest,
  delay,
  finalize,
  map,
  of,
  switchMap,
  tap,
} from 'rxjs';
import { ignoreErrors } from '@utils/utils';

@Component({
  selector: 'app-user-team',
  templateUrl: './user-team.component.html',
  styleUrls: ['./user-team.component.scss'],
})
export class UserTeamComponent extends AdminComponent<
  UserTeamPopupComponent,
  UserTeam,
  UserTeamService
> {
  @Input({ required: true }) internalUser!: InternalUser;
  service = inject(UserTeamService);
  actions: ContextMenuActionContract<UserTeam>[] = [
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
  override data$: Observable<UserTeam[]> = this._load();
  protected override _load(): Observable<UserTeam[]> {
    return of(undefined)
      .pipe(delay(0)) // need it to make little delay till the userFilter input get bind.
      .pipe(
        switchMap(() => {
          return combineLatest([this.reload$, this.paginate$]).pipe(
            switchMap(([, paginationOptions]) => {
              this.loadingSubject.next(true);
              return this.service
                .loadUserTeams(this.internalUser.id, paginationOptions)
                .pipe(
                  finalize(() => this.loadingSubject.next(false)),
                  ignoreErrors(),
                );
            }),
            tap(({ count }) => {
              this.length = count;
              this.loadingSubject.next(false); //TODO move to finalize in loadComposite and load
            }),
            map((response) => response.rs),
          );
        }),
      );
  }

  // here we have a new implementation for displayed/filter Columns for the table
  columnsWrapper: ColumnsWrapper<UserTeam> = new ColumnsWrapper(
    new TextFilterColumn('teamName'),
    new NoneFilterColumn('actions'),
  ).attacheFilter(this.filter$);

  override _getCreateExtras(): {
    mappedUserTeamsIds: number[];
    internalUserId: number;
  } {
    return {
      mappedUserTeamsIds: this.dataSource.data.map((team) => team.teamInfo.id),
      internalUserId: this.internalUser.id,
    };
  }
}
