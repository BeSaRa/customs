import { EventEmitter, InputSignal } from '@angular/core';
import { Violation } from '@models/violation';
import { Offender } from '@models/offender';
import { ReportType } from '@app-types/validation-return-type';

export interface OffenderCriteriaDataContract {
  caseId: InputSignal<string>;
  violations: Violation[];
  offenders: Offender[];
  askForSaveModel: EventEmitter<void>;
  askForViolationListReload: EventEmitter<void>;
  reportType: ReportType;
}
