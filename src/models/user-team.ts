import { BaseModel } from '@abstracts/base-model';
import { UserTeamService } from '@services/user-team.service';
import { UserTeamInterceptor } from '@model-interceptors/user-team-interceptor';
import { InterceptModel } from 'cast-response';
import { AdminResult } from './admin-result';
import { CustomValidators } from '@validators/custom-validators';
import { Observable } from 'rxjs';
import { inject } from '@angular/core';

const { send, receive } = new UserTeamInterceptor();

@InterceptModel({ send, receive })
export class UserTeam extends BaseModel<UserTeam, UserTeamService> {
  $$__service_name__$$ = 'UserTeamService';
  internalUserId!: number;
  teamId!: number;
  internalUserInfo!: AdminResult;
  teamInfo!: AdminResult;
  selectedTeams!: number[];
  override status = 1;

  buildForm(controls = false): object {
    const { selectedTeams } = this;
    return {
      selectedTeams: controls ? [selectedTeams, [CustomValidators.required]] : selectedTeams,
    };
  }

  override delete(): Observable<UserTeam> {
    return this.$$getService$$<UserTeamService>().delete(this.id);
  }
}
