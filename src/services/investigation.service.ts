import { inject, Injectable } from '@angular/core';
import { BaseCaseService } from '@abstracts/base-case.service';
import { Constructor } from '@app-types/constructors';
import { ServiceContract } from '@contracts/service-contract';
import { Investigation } from '@models/investigation';
import { CastResponseContainer } from 'cast-response';

import { MatDialogRef } from '@angular/material/dialog';
import { ViolationPopupComponent } from '@standalone/popups/violation-popup/violation-popup.component';
import { ViolationService } from '@services/violation.service';

@CastResponseContainer({
  $default: {
    model: () => Investigation,
  },
})
@Injectable({
  providedIn: 'root',
})
export class InvestigationService extends BaseCaseService<Investigation> implements ServiceContract {
  serviceName = 'InvestigationService';
  violationService = inject(ViolationService);

  getUrlSegment(): string {
    return this.urlService.URLS.INVESTIGATION;
  }

  getModelInstance(): Investigation {
    return new Investigation();
  }

  getModelClass(): Constructor<Investigation> {
    return Investigation;
  }

  openAddViolation(caseId: string): MatDialogRef<ViolationPopupComponent> {
    return this.violationService.openCreateDialog(undefined, { caseId });
  }
}
