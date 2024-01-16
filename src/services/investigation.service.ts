import { inject, Injectable } from "@angular/core";
import { BaseCaseService } from "@abstracts/base-case.service";
import { Constructor } from "@app-types/constructors";
import { ServiceContract } from "@contracts/service-contract";
import { Investigation } from "@models/investigation";
import { CastResponse, CastResponseContainer } from "cast-response";

import { MatDialogRef } from "@angular/material/dialog";
import { ViolationPopupComponent } from "@standalone/popups/violation-popup/violation-popup.component";
import { ViolationService } from "@services/violation.service";
import { Subject } from "rxjs";
import { TransformerAction } from "@contracts/transformer-action";
import { LangKeysContract } from "@contracts/lang-keys-contract";
import { SusbendEmployee } from "@models/susbend-employee";

@CastResponseContainer({
  $default: {
    model: () => Investigation,
  },
  susbend: {
    model: () => SusbendEmployee,
  },
})
@Injectable({
  providedIn: "root",
})
export class InvestigationService
  extends BaseCaseService<Investigation>
  implements ServiceContract
{
  serviceKey: keyof LangKeysContract = "menu_investigation";
  serviceName = "InvestigationService";
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
    caseId: string,
    transformer$: Subject<TransformerAction<Investigation>>
  ): MatDialogRef<ViolationPopupComponent> {
    return this.violationService.openCreateDialog(undefined, {
      caseId,
      transformer$,
    });
  }
  @CastResponse(() => Investigation, { unwrap: "rs", fallback: "$susbend" })
  suspendEmployee(body: SusbendEmployee) {
    return this.http.post(this.getUrlSegment() + "/suspend-employee", body);
  }
  @CastResponse(() => Investigation, { unwrap: "rs", fallback: "$susbend" })
  extendSuspendEmployee(body: SusbendEmployee) {
    return this.http.post(
      this.getUrlSegment() + "/extend-suspend-employee",
      body
    );
  }
}
