import { EventEmitter, InputSignal } from '@angular/core';
import { Offender } from '@models/offender';
import { ReportType } from '@app-types/validation-return-type';
import { Investigation } from '@models/investigation';

export interface OffenderCriteriaDataContract {
  model: InputSignal<Investigation>;
  askForSaveModel: EventEmitter<void>;
  askForViolationListReload: EventEmitter<void>;
  reportType: InputSignal<ReportType>;
  offenderAdded: EventEmitter<Offender>;
}
