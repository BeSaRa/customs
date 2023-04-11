import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdministrationRoutingModule } from './administration-routing.module';
import { AdministrationComponent } from './administration.component';
import { LocalizationPopupComponent } from './popups/localization-popup/localization-popup.component';
import { LocalizationComponent } from './components/localization/localization.component';

@NgModule({
  declarations: [
    AdministrationComponent,
    LocalizationPopupComponent,
    LocalizationComponent,
  ],
  imports: [CommonModule, AdministrationRoutingModule],
})
export class AdministrationModule {}
