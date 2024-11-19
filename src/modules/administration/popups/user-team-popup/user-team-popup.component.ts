import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CrudDialogDataContract } from '@contracts/crud-dialog-data-contract';
import { UserTeam } from '@models/user-team';
import { AdminDialogComponent } from '@abstracts/admin-dialog-component';
import { UntypedFormGroup } from '@angular/forms';
import {
  catchError,
  combineLatest,
  exhaustMap,
  filter,
  forkJoin,
  isObservable,
  map,
  Observable,
  of,
  Subject,
  switchMap,
  takeUntil,
  throwError,
} from 'rxjs';
import { OperationType } from '@enums/operation-type';
import { TeamService } from '@services/team.service';
import { Team } from '@models/team';
import { ignoreErrors } from '@utils/utils';
import { UserTeamService } from '@services/user-team.service';
import { InternalUserOUService } from '@services/internal-user-ou.service';

@Component({
  selector: 'app-user-team-popup',
  templateUrl: './user-team-popup.component.html',
  styleUrls: ['./user-team-popup.component.scss'],
})
export class UserTeamPopupComponent extends AdminDialogComponent<UserTeam> {
  private teamsService = inject(TeamService);
  private userTeamService = inject(UserTeamService);
  private internalUserOUService = inject(InternalUserOUService);
  teams!: Team[];
  form!: UntypedFormGroup;
  data: CrudDialogDataContract<UserTeam> = inject(MAT_DIALOG_DATA);
  saveUserTeams$: Subject<void> = new Subject<void>();

  protected override _init(): void {
    this.listenToSaveUserTeams();
    combineLatest([
      this.teamsService.loadAsLookups(),
      this.internalUserOUService.internalUserOUCriteria({
        internalUserId: this.data.extras?.internalUserId as number,
      }),
    ])
      .pipe(
        map(([teams, internalUserOUs]) => {
          // const organizationUnitIds = internalUserOUs.map(
          //   internalUserOu => internalUserOu.organizationUnitId,
          // );
          return teams;
          // const filteredTeams = teams.filter(
          //   team =>
          //     team.parentDeptId === -1 ||
          //     !(this.data.extras?.mappedUserTeamsIds as number[]).includes(
          //       team.id,
          //     ),
          // );
          // return filteredTeams.filter(
          //   team =>
          //     team.parentDeptId === -1 ||
          //     organizationUnitIds.includes(team.ouId) ||
          //     team.ouId === null,
          // );
        }),
      )
      .subscribe(filteredTeams => {
        this.teams = filteredTeams;
      });
  }

  _buildForm(): void {
    this.form = this.fb.group(this.model.buildForm(true));
  }

  protected _beforeSave(): boolean | Observable<boolean> {
    this.form.markAllAsTouched();
    return this.form.valid;
  }

  protected _prepareModel(): UserTeam | Observable<UserTeam> {
    return new UserTeam().clone<UserTeam>({
      ...this.model,
      internalUserId: this.data.extras?.internalUserId,
      ...this.form.value,
    });
  }

  protected _afterSave(): void {
    this.operation = OperationType.UPDATE;
    this.toast.success(
      this.lang.map.msg_save_x_success.change({ x: this.model.getNames() }),
    );
    // you can close the dialog after save here
    this.dialogRef.close(this.model);
  }

  private saveUserTeam(userTeam: {
    internalUserId: number;
    teamId: number;
    status: number;
  }): Observable<unknown> {
    return this.userTeamService.saveUserTeam(userTeam);
  }

  private saveUserTeams(userTeam: UserTeam): Observable<unknown[]> {
    const requests$ = userTeam.selectedTeams.map(teamId =>
      this.saveUserTeam({
        internalUserId: userTeam.internalUserId,
        teamId: teamId,
        status: userTeam.status,
      }),
    );
    return forkJoin(requests$);
  }

  protected listenToSaveUserTeams() {
    this.saveUserTeams$
      .pipe(
        takeUntil(this.destroy$),
        switchMap(() => {
          const result = this._beforeSave();
          return isObservable(result) ? result : of(result);
        }),
      )
      .pipe(filter(value => value))
      .pipe(
        switchMap(() => {
          const result = this._prepareModel();
          return isObservable(result) ? result : of(result);
        }),
      )
      .pipe(
        exhaustMap(userTeam => {
          return this.saveUserTeams(userTeam).pipe(
            catchError(error => {
              this._saveFail(error);
              return throwError(error);
            }),
            ignoreErrors(),
          );
        }),
      )
      .subscribe(() => {
        this._afterSave();
      });
  }
}
