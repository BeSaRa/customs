import { Component, inject } from '@angular/core';
import { AdminComponent } from '@abstracts/admin-component';
import { ViolationType } from '@models/violation-type';
import { ViolationTypeService } from '@services/violation-type.service';
import { ViolationTypePopupComponent } from '@modules/administration/popups/violation-type-popup/violation-type-popup.component';
import { LangCodes } from '@enums/lang-codes';
import { LookupService } from '@services/lookup.service';
import { ViolationClassificationService } from '@services/violation-classification.service';

@Component({
  selector: 'app-violation-type',
  templateUrl: './violation-type.component.html',
  styleUrls: ['./violation-type.component.scss'],
})
export class ViolationTypeComponent extends AdminComponent<
  ViolationTypePopupComponent,
  ViolationType,
  ViolationTypeService
> {
  service = inject(ViolationTypeService);
  displayedColumns: string[] = [
    'select',
    'arName',
    'enName',
    'penaltyType',
    'violationClassificationId',
    'actions',
  ];
  langCode = this.lang.getCurrent().code;
  isArabic = this.langCode === LangCodes.AR;
  types = inject(LookupService).lookups.penaltyType;
  violationClassificationService = inject(ViolationClassificationService);
  classifications!: any[];
  override ngOnInit(): void {
    super.ngOnInit();
    this.violationClassificationService.loadAsLookups().subscribe((data) => {
      console.log(data);
      this.classifications = data;
    });
  }
  getPenaltyTypeName(penaltyTypeId: number) {
    return this.isArabic
      ? this.types.find((type) => type.lookupKey === penaltyTypeId)?.arName
      : this.types.find((type) => type.lookupKey === penaltyTypeId)?.enName;
  }
  getViolationClassificationName(violationClassificationId: number) {
    if (!this.classifications) return '';
    return this.isArabic
      ? this.classifications.find(
          (classification) => classification.id === violationClassificationId
        )?.arName
      : this.classifications.find(
          (classification) => classification.id === violationClassificationId
        )?.enName;
  }
}
