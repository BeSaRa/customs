import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExternalPagesRoutingModule } from './external-pages-routing.module';
import { ExternalPagesComponent } from './external-pages.component';
import { ExternalNavbarComponent } from '@standalone/components/external-navbar/external-navbar.component';
import { RouterModule } from '@angular/router';
import { InputComponent } from '@standalone/components/input/input.component';
import { ReactiveFormsModule } from '@angular/forms';
import { IconButtonComponent } from '@standalone/components/icon-button/icon-button.component';
import { MatTooltip } from '@angular/material/tooltip';

@NgModule({
  declarations: [ExternalPagesComponent],
  imports: [
    CommonModule,
    RouterModule,
    ExternalPagesRoutingModule,
    ExternalNavbarComponent,
    InputComponent,
    ReactiveFormsModule,
    IconButtonComponent,
    MatTooltip,
  ],
})
export class ExternalPagesModule {}
