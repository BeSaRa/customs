import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExternalPagesRoutingModule } from './external-pages-routing.module';
import { ExternalPagesComponent } from './external-pages.component';
import { ExternalNavbarComponent } from '@standalone/components/external-navbar/external-navbar.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [ExternalPagesComponent],
  imports: [
    CommonModule,
    RouterModule,
    ExternalPagesRoutingModule,
    ExternalNavbarComponent,
  ],
})
export class ExternalPagesModule {}
