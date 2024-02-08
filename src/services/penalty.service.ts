import { computed, Injectable, signal } from '@angular/core';
import { Penalty } from '@models/penalty';
import { CastResponse, CastResponseContainer } from 'cast-response';
import { BaseCrudWithDialogService } from '@abstracts/base-crud-with-dialog-service';
import { ComponentType } from '@angular/cdk/portal';
import { PenaltyPopupComponent } from '@modules/administration/popups/penalty-popup/penalty-popup.component';
import { Constructor } from '@app-types/constructors';
import { Pagination } from '@models/pagination';
import { Observable } from 'rxjs';
import { HttpParams } from '@angular/common/http';
import { SystemPenalties } from '@enums/system-penalties';

@CastResponseContainer({
  $pagination: {
    model: () => Pagination,
    shape: {
      'rs.*': () => Penalty,
    },
  },
  $default: {
    model: () => Penalty,
  },
})
@Injectable({
  providedIn: 'root',
})
export class PenaltyService extends BaseCrudWithDialogService<
  PenaltyPopupComponent,
  Penalty
> {
  serviceName = 'PenaltyService';
  private _systemPenalties = signal<Penalty[]>([]);
  systemPenalties = computed(() => this._systemPenalties());
  systemPenaltiesMap = computed<Record<SystemPenalties, Penalty>>(() => {
    return this.systemPenalties().reduce<Record<SystemPenalties, Penalty>>(
      (acc, item) => {
        return { ...acc, [item.penaltyKey]: item };
      },
      {} as Record<SystemPenalties, Penalty>,
    );
  });

  protected getModelClass(): Constructor<Penalty> {
    return Penalty;
  }

  protected getModelInstance(): Penalty {
    return new Penalty();
  }

  getDialogComponent(): ComponentType<PenaltyPopupComponent> {
    return PenaltyPopupComponent;
  }

  getUrlSegment(): string {
    return this.urlService.URLS.PENALTY;
  }

  @CastResponse(() => Penalty, { unwrap: 'rs', fallback: '$default' })
  getFilteredPenalties(
    options: Partial<{ penaltySigner: number; offenderLevel: number }>,
  ): Observable<Penalty[]> {
    return this.http.get<Penalty[]>(this.getUrlSegment() + `/violation`, {
      params: new HttpParams({
        fromObject: { ...options },
      }),
    });
  }

  setSystemPenalties(systemPenalties: Penalty[]) {
    this._systemPenalties.set(systemPenalties);
  }
}
