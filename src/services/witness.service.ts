import { BaseCrudService } from '@abstracts/base-crud-service';
import { inject, Injectable } from '@angular/core';
import { Constructor } from '@app-types/constructors';
import { Pagination } from '@models/pagination';
import { Witness } from '@models/witness';
import { DialogService } from '@services/dialog.service';
import { WitnessCriteriaPopupComponent } from '@standalone/popups/witness-criteria-popup/witness-criteria-popup.component';
import { CastResponseContainer } from 'cast-response';
import { Observable, Subject, tap } from 'rxjs';
import { map } from 'rxjs/operators';

@CastResponseContainer({
  $pagination: {
    model: () => Pagination,
    shape: {
      'rs.*': () => Witness,
    },
  },
  $default: {
    model: () => Witness,
  },
})
@Injectable({
  providedIn: 'root',
})
export class WitnessService extends BaseCrudService<Witness> {
  serviceName = 'WitnessService';

  map = new Map<string, { loading: boolean; witness$: Subject<Witness[]> }>();
  dialog = inject(DialogService);

  protected getModelClass(): Constructor<Witness> {
    return Witness;
  }

  protected getModelInstance(): Witness {
    return new Witness();
  }

  getUrlSegment(): string {
    return this.urlService.URLS.WITNESS;
  }

  openCreateDialog(caseId: string, witnessList: Witness[]) {
    return this.dialog.open(WitnessCriteriaPopupComponent, {
      data: {
        caseId,
        witnessList,
      },
    });
  }

  loadForCase(caseId: string): Observable<Witness[]> {
    const loadWitnessAndUpdateState = (caseId: string) => {
      return this.load(undefined, { caseId }).pipe(
        map(res => res.rs),
        tap(list => {
          this.map.get(caseId)!.loading = false;
          this.map.get(caseId)?.witness$.next(list);
        }),
      );
    };

    const getOrLoadWitness = (caseId: string) => {
      return (() => {
        this.map.set(caseId, {
          loading: true,
          witness$: new Subject(),
        });
        return loadWitnessAndUpdateState(caseId);
      })();
    };
    return this.map.has(caseId)
      ? (() => {
          return this.map.get(caseId)!.loading
            ? (() => {
                return loadWitnessAndUpdateState(caseId);
              })()
            : loadWitnessAndUpdateState(caseId);
        })()
      : (() => {
          return getOrLoadWitness(caseId);
        })();
  }
}
