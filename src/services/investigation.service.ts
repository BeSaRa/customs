import { EventEmitter, inject, Injectable, InputSignal } from '@angular/core';
import { BaseCaseService } from '@abstracts/base-case.service';
import { Constructor } from '@app-types/constructors';
import { ServiceContract } from '@contracts/service-contract';
import { Investigation } from '@models/investigation';
import { CastResponse, CastResponseContainer } from 'cast-response';

import { MatDialogRef } from '@angular/material/dialog';
import { ViolationPopupComponent } from '@standalone/popups/violation-popup/violation-popup.component';
import { ViolationService } from '@services/violation.service';
import { LangKeysContract } from '@contracts/lang-keys-contract';
import { SusbendEmployee } from '@models/susbend-employee';
import { ReportType } from '@app-types/validation-return-type';

@CastResponseContainer({
  $default: {
    model: () => Investigation,
  },
  suspend: {
    model: () => SusbendEmployee,
  },
})
@Injectable({
  providedIn: 'root',
})
export class InvestigationService
  extends BaseCaseService<Investigation>
  implements ServiceContract
{
  serviceKey: keyof LangKeysContract = 'menu_investigation';
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

  openAddViolation(
    model: InputSignal<Investigation>,
    askForSaveModel: EventEmitter<void>,
    reportType: InputSignal<ReportType>,
  ): MatDialogRef<ViolationPopupComponent> {
    return this.violationService.openCreateDialog(undefined, {
      model,
      askForSaveModel,
      reportType,
    });
  }

  @CastResponse(() => Investigation, { unwrap: 'rs', fallback: 'suspend' })
  suspendEmployee(body: SusbendEmployee) {
    return this.http.post(this.getUrlSegment() + '/suspend-employee', body);
  }

  @CastResponse(() => Investigation, { unwrap: 'rs', fallback: 'suspend' })
  extendSuspendEmployee(body: SusbendEmployee) {
    return this.http.post(
      this.getUrlSegment() + '/extend-suspend-employee',
      body,
    );
  }
}
