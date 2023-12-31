import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CrudDialogDataContract } from '@contracts/crud-dialog-data-contract';
import { UserTeam } from '@models/user-team';
import { AdminDialogComponent } from '@abstracts/admin-dialog-component';
import { UntypedFormGroup } from '@angular/forms';
import { Observable, Subject, catchError, exhaustMap, filter, forkJoin, isObservable, map, of, switchMap, takeUntil, throwError } from 'rxjs';
import { OperationType } from '@enums/operation-type';
import { TeamService } from '@services/team.service';
import { Team } from '@models/team';
import { ignoreErrors } from '@utils/utils';
import { UserTeamService } from '@services/user-team.service';

@Component({
  selector: 'app-user-team-popup',
  templateUrl: './user-team-popup.component.html',
  styleUrls: ['./user-team-popup.component.scss'],
})
export class UserTeamPopupComponent extends AdminDialogComponent<UserTeam> {
  private teamsService = inject(TeamService);
  private userTeamService = inject(UserTeamService);
  teams!: Team[];
  form!: UntypedFormGroup;
  data: CrudDialogDataContract<UserTeam> = inject(MAT_DIALOG_DATA);
  saveUserTeams$: Subject<void> = new Subject<void>();

  protected override _init(): void {
    this.listenToSaveUserTeams();
    this.teamsService
      .loadAsLookups()
      .pipe(map(teams => teams.filter(team => !(this.data.extras?.mappedUserTeamsIds as number[]).includes(team.id))))
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
    this.toast.success(this.lang.map.msg_save_x_success.change({ x: this.model.getNames() }));
    // you can close the dialog after save here
    this.dialogRef.close(this.model);
  }

  private saveUserTeam(userTeam: { internalUserId: number; teamId: number; status: number }): Observable<unknown> {
    return this.userTeamService.saveUserTeam(userTeam);
  }

  private saveUserTeams(userTeam: UserTeam): Observable<unknown[]> {
    const requests$ = userTeam.selectedTeams.map(teamId =>
      this.saveUserTeam({ internalUserId: userTeam.internalUserId, teamId: teamId, status: userTeam.status })
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
        })
      )
      .pipe(filter(value => value))
      .pipe(
        switchMap(() => {
          const result = this._prepareModel();
          return isObservable(result) ? result : of(result);
        })
      )
      .pipe(
        exhaustMap(userTeam => {
          return this.saveUserTeams(userTeam).pipe(
            catchError(error => {
              this._saveFail(error);
              return throwError(error);
            }),
            ignoreErrors()
          );
        })
      )
      .subscribe(res => {
        this._afterSave();
      });
  }
}
