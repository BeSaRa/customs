import { BaseCrudService } from '@abstracts/base-crud-service';
import { HttpContext } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Constructor } from '@app-types/constructors';
import { AppFullRoutes } from '@constants/app-full-routes';
import { AppPermissionsType } from '@constants/app-permissions';
import { AppPermissionsGroup } from '@constants/app-permissions-group';
import { NO_LOADER_TOKEN } from '@http-contexts/tokens';
import { AdminResult } from '@models/admin-result';
import { InboxCounter } from '@models/inbox-counter';
import { Pagination } from '@models/pagination';
import { CastResponse, CastResponseContainer } from 'cast-response';
import { filter, take, timer } from 'rxjs';
import { ConfigService } from './config.service';
import { EmployeeService } from './employee.service';

@CastResponseContainer({
  $pagination: {
    model: () => Pagination,
    shape: {
      'rs.*': () => InboxCounter,
    },
  },
  $default: {
    model: () => InboxCounter,
  },
})
@Injectable({
  providedIn: 'root',
})
export class InboxCounterService extends BaseCrudService<InboxCounter> {
  serviceName = 'InboxCounterService';
  configService = inject(ConfigService);
  employeeService = inject(EmployeeService);
  router = inject(Router);

  constructor() {
    super();
    this._startPolling()
      .pipe(
        filter(() =>
          this.employeeService.hasAllPermissions(
            AppPermissionsGroup.DASHBOARD as unknown as (keyof AppPermissionsType)[],
          ),
        ),
        filter(() => this.router.url === AppFullRoutes.LANDING_PAGE),
      )
      .subscribe(() => this._loadAndSetUserCounters());
  }

  private _userCounters = signal<InboxCounter[]>([]);
  userCounters = computed(() => this._userCounters());
  userTeamsCounters = computed(() =>
    Object.values(
      this._userCounters().reduce(
        (acc, cur) => {
          if (acc[cur.teamId]) acc[cur.teamId].counters.push(cur);
          else acc[cur.teamId] = { team: cur.teamInfo, counters: [cur] };
          return acc;
        },
        {} as Record<number, { team: AdminResult; counters: InboxCounter[] }>,
      ),
    ),
  );

  protected getModelClass(): Constructor<InboxCounter> {
    return InboxCounter;
  }

  protected getModelInstance(): InboxCounter {
    return new InboxCounter();
  }

  getUrlSegment(): string {
    return this.urlService.URLS.INBOX_COUNTER;
  }

  private _startPolling() {
    return timer(
      0,
      this.configService.CONFIG.TIME_TO_RELOAD_USER_INBOX_COUNTERS * 1000,
    );
  }

  private _loadAndSetUserCounters() {
    this._getUserCounters()
      .pipe(take(1))
      .subscribe(res => this._userCounters.set(res));
  }

  @CastResponse()
  private _getUserCounters() {
    return this.http.get<InboxCounter[]>(this.getUrlSegment() + '/user', {
      context: new HttpContext().set(NO_LOADER_TOKEN, true),
    });
  }
}
