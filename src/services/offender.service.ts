import { inject, Injectable } from '@angular/core';
import { Offender } from '@models/offender';
import { CastResponse, CastResponseContainer } from 'cast-response';
import { Constructor } from '@app-types/constructors';
import { Pagination } from '@models/pagination';
import { BaseCrudService } from '@abstracts/base-crud-service';
import { HttpParams } from '@angular/common/http';
import { MawaredEmployee } from '@models/mawared-employee';
import { ClearingAgent } from '@models/clearing-agent';
import { OffenderTypes } from '@enums/offender-types';
import { FetchOptionsContract } from '@contracts/fetch-options-contract';
import { SortOptionsContract } from '@contracts/sort-options-contract';
import { map, Observable } from 'rxjs';
import { InvestigationForExternalUser } from '@models/investigation-for-external-user';
import { PenaltyDecisionCriteria } from '@models/penalty-decision-criteria';
import { BlobModel } from '@models/blob-model';
import { DomSanitizer } from '@angular/platform-browser';

@CastResponseContainer({
  $pagination: {
    model: () => Pagination,
    shape: {
      'rs.*': () => Offender,
    },
  },
  $paginationForCases: {
    model: () => Pagination,
    shape: {
      'rs.*': () => InvestigationForExternalUser,
    },
  },
  $default: {
    model: () => Offender,
  },
})
@Injectable({
  providedIn: 'root',
})
export class OffenderService extends BaseCrudService<Offender> {
  serviceName = 'OffenderService';
  domSanitizer = inject(DomSanitizer);

  protected getModelClass(): Constructor<Offender> {
    return Offender;
  }

  protected getModelInstance(): Offender {
    return new Offender();
  }

  getUrlSegment(): string {
    return this.urlService.URLS.OFFENDER;
  }

  isEmployee(model: MawaredEmployee | ClearingAgent): model is MawaredEmployee {
    return model.type === OffenderTypes.EMPLOYEE;
  }

  isAgent(model: MawaredEmployee | ClearingAgent): model is ClearingAgent {
    return model.type === OffenderTypes.BROKER;
  }

  getDecisionFileAttachments(vsid: string): Observable<BlobModel> {
    return this.http
      .get(this.getUrlSegment() + `/admin/document/latest/${vsid}/content`, {
        responseType: 'blob',
      })
      .pipe(map(blob => new BlobModel(blob, this.domSanitizer)));
  }

  @CastResponse()
  getAttachmentsCount(offenderIds: number[]) {
    return this.http.get<Offender[]>(
      this.getUrlSegment() + `/attachment/count`,
      {
        params: new HttpParams({
          fromObject: {
            offenderIds: offenderIds.join(', '),
          },
        }),
      },
    );
  }
  @CastResponse(() => Offender, { unwrap: 'rs' })
  loadDecisionSerial(decisionSerial: number) {
    return this.http.get<Offender>(
      this.getUrlSegment() + '/admin/decision-serial',
      {
        params: new HttpParams({
          fromObject: {
            decisionSerial,
          },
        }),
      },
    );
  }
  @CastResponse(() => Offender, { unwrap: 'rs' })
  loadPenaltyModification(offenderId: number) {
    return this.http.get<Offender[]>(
      this.getUrlSegment() + '/admin/penalty-modification',
      {
        params: new HttpParams({
          fromObject: {
            offenderId,
          },
        }),
      },
    );
  }

  @CastResponse(undefined, {
    fallback: '$paginationForCases',
  })
  loadCasesForExternal(
    extra: { [key: string]: unknown } = {},
    options: FetchOptionsContract = {
      offset: 0,
      limit: 50,
    },
    sortOptions?: SortOptionsContract,
  ): Observable<Pagination<InvestigationForExternalUser[]>> {
    return this.http.get<Pagination<InvestigationForExternalUser[]>>(
      this.getUrlSegment() + '/admin/cases/external',
      {
        params: new HttpParams({
          fromObject: { ...extra, ...options, ...sortOptions },
        }),
      },
    );
  }

  @CastResponse(undefined, {
    fallback: '$pagination',
  })
  loadByCriteria(
    criteria: Partial<PenaltyDecisionCriteria>,
  ): Observable<Pagination<Offender[]>> {
    if (criteria) {
      delete criteria.buildForm;
      Object.keys(criteria as unknown as object).forEach(key => {
        if (
          criteria &&
          (criteria[key as keyof PenaltyDecisionCriteria] === null ||
            criteria[key as keyof PenaltyDecisionCriteria] === undefined)
        ) {
          delete criteria[key as keyof PenaltyDecisionCriteria];
        }
      });
    }
    if (criteria.decisionDate) {
      criteria.decisionDate = new Date(
        criteria.decisionDate,
      ).toLocaleDateString('en-CA');
    }
    return this.http.get<Pagination<Offender[]>>(
      this.getUrlSegment() + '/admin/criteria',
      {
        params: new HttpParams({
          fromObject: { ...(criteria as object) },
        }),
      },
    );
  }
}
