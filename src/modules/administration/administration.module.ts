import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdministrationRoutingModule } from './administration-routing.module';
import { AdministrationComponent } from './administration.component';
import { LocalizationPopupComponent } from './popups/localization-popup/localization-popup.component';
import { LocalizationComponent } from './components/localization/localization.component';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { ButtonComponent } from '@standalone/components/button/button.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSelectModule } from '@angular/material/select';

import { IconButtonComponent } from '@standalone/components/icon-button/icon-button.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSortModule } from '@angular/material/sort';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { InputComponent } from '@standalone/components/input/input.component';
import { MatDialogModule } from '@angular/material/dialog';
import { TextareaComponent } from '@standalone/components/textarea/textarea.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ViolationClassificationComponent } from '@modules/administration/components/violation-classification/violation-classification.component';
import { ViolationClassificationPopupComponent } from '@modules/administration/popups/violation-classification-popup/violation-classification-popup.component';
import { ViolationTypeComponent } from '@modules/administration/components/violation-type/violation-type.component';
import { ViolationTypePopupComponent } from '@modules/administration/popups/violation-type-popup/violation-type-popup.component';

@NgModule({
  declarations: [
    AdministrationComponent,
    LocalizationPopupComponent,
    LocalizationComponent,
    ViolationClassificationComponent,
    ViolationClassificationPopupComponent,
    ViolationTypeComponent,
    ViolationTypePopupComponent,
  ],
  imports: [
    CommonModule,
    AdministrationRoutingModule,
    MatTableModule,
    MatPaginatorModule,
    ButtonComponent,
    MatIconModule,
    MatSlideToggleModule,
    MatSelectModule,
    MatButtonModule,
    IconButtonComponent,
    MatTooltipModule,
    MatSortModule,
    MatCheckboxModule,
    InputComponent,
    MatDialogModule,
    TextareaComponent,
    ReactiveFormsModule,
  ],
})
export class AdministrationModule {}
