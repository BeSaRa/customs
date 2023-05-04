import { Component, inject } from '@angular/core';
import { AdminComponent } from '@abstracts/admin-component';
import { ViolationClassification } from '@models/violation-classification';
import { ViolationClassificationService } from '@services/violation-classification.service';
import { ViolationClassificationPopupComponent } from '@modules/administration/popups/violation-classification-popup/violation-classification-popup.component';
import { LookupService } from '@services/lookup.service';
import { LangService } from '@services/lang.service';
import { LangCodes } from '@enums/lang-codes';
import { LookupMapContract } from '@contracts/lookup-map-contract';
import { Lookup } from '@models/lookup';

@Component({
  selector: 'app-violation-classification',
  templateUrl: './violation-classification.component.html',
  styleUrls: ['./violation-classification.component.scss'],
})
export class ViolationClassificationComponent extends AdminComponent<
  ViolationClassificationPopupComponent,
  ViolationClassification,
  ViolationClassificationService
> {
  service = inject(ViolationClassificationService);
  displayedColumns: string[] = [
    'select',
    'arName',
    'enName',
    'penaltyType',
    'actions',
  ];
  langCode = this.lang.getCurrent().code;
  isArabic = this.langCode === LangCodes.AR;
  types = inject(LookupService).lookups.penaltyType;
  // typesName = this.types.map((type) => {
  //   return { ...type, name: this.isArabic ? type.arName : type.enName };
  // });
  getPenaltyTypeName(penaltyTypeId: number) {
    return this.isArabic
      ? this.types.find((type) => type.lookupKey === penaltyTypeId)?.arName
      : this.types.find((type) => type.lookupKey === penaltyTypeId)?.enName;
  }
}
