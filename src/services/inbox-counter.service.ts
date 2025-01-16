import { BaseCrudService } from '@abstracts/base-crud-service';
import { HttpContext } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Constructor } from '@app-types/constructors';
import { AppFullRoutes } from '@constants/app-full-routes';
import { AppPermissionsType } from '@constants/app-permissions';
import { AppPermissionsGroup } from '@constants/app-permissions-group';
import { NO_ERROR_HANDLE, NO_LOADER_TOKEN } from '@http-contexts/tokens';
import { AdminResult } from '@models/admin-result';
import { InboxCounter } from '@models/inbox-counter';
import { Pagination } from '@models/pagination';
import { CastResponse, CastResponseContainer } from 'cast-response';
import { filter, Subscription, tap, timer } from 'rxjs';
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

  private _poolingSubscribtion?: Subscription;

  constructor() {
    super();
    this.loadAndSetUserCounters(false);
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

  startPolling() {
    this._poolingSubscribtion = timer(
      0,
      this.configService.CONFIG.TIME_TO_RELOAD_USER_INBOX_COUNTERS * 1000,
    )
      .pipe(
        filter(() =>
          this.employeeService.hasAllPermissions(
            AppPermissionsGroup.DASHBOARD as unknown as (keyof AppPermissionsType)[],
          ),
        ),
        filter(() => this.router.url === AppFullRoutes.LANDING_PAGE),
      )
      .subscribe(() => this.loadAndSetUserCounters());
  }

  stopPolling() {
    this._poolingSubscribtion?.unsubscribe();
  }

  loadAndSetUserCounters(hideEffect = true) {
    this._getUserCounters(hideEffect)
      .pipe(tap(() => this._userCounters.set([])))
      .subscribe(res =>
        setTimeout(() => {
          this._userCounters.set(res);
        }, 0),
      );
  }

  @CastResponse()
  private _getUserCounters(hideEffect: boolean) {
    return this.http.get<InboxCounter[]>(
      this.getUrlSegment() + '/user',
      hideEffect
        ? {
            context: new HttpContext()
              .set(NO_LOADER_TOKEN, true)
              .set(NO_ERROR_HANDLE, true),
          }
        : {},
    );
  }
}
