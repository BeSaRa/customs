import { inject, Injectable } from '@angular/core';
import { filter, interval, Subscription, tap } from 'rxjs';
import { AuthService } from './auth.service';
import { InfoService } from './info.service';
import { LangService } from './lang.service';

@Injectable({
  providedIn: 'root',
})
export class IdleService {
  private _auth = inject(AuthService);
  private _lang = inject(LangService);
  private _info = inject(InfoService);

  private _idleIntervalSubscription?: Subscription;

  setIdleInterval() {
    console.log('chech timeout: ', this._getSessionTimeOut());
    if (!this._getSessionTimeOut()) return;
    this._idleIntervalSubscription?.unsubscribe();
    this._idleIntervalSubscription = interval(
      this._getSessionTimeOut()! * 60 * 1000,
    )
      .pipe(tap(() => console.log('session timeout')))
      .pipe(filter(() => this._auth.isAuthenticated()))
      .subscribe(() => {
        console.log('session logout');
        this._idleIntervalSubscription?.unsubscribe();
        this._auth.logout(this._lang.map.session_is_over);
      });
  }

  private _getSessionTimeOut(): number | undefined {
    return this._info.info?.globalSetting?.sessionTimeout;
  }
}
