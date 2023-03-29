import '@utils/protoypes/custom-prototypes';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule, DomSanitizer } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { SharedModule } from '@modules/shared/shared.module';
import { LoginComponent } from './components/login/login.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconRegistry } from '@angular/material/icon';
import { forkJoin, Observable, switchMap, tap } from 'rxjs';
import { ConfigService } from '@services/config.service';
import { UrlService } from '@services/url.service';
import { InfoService } from '@services/info.service';
import { LookupService } from '@services/lookup.service';
import { InputComponent } from '@standalone/input/input.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { ControlDirective } from '@standalone/directives/control.directive';

@NgModule({
  declarations: [AppComponent, LoginComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    SharedModule,
    BrowserAnimationsModule,
    MatSnackBarModule,
    MatDialogModule,
    InputComponent,
    FormsModule,
    ReactiveFormsModule,
    NgxMaskDirective,
    ControlDirective,
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: AppModule.initialize,
      deps: [ConfigService, UrlService, InfoService, LookupService],
      multi: true,
    },
    provideNgxMask(),
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor(registry: MatIconRegistry, domSanitizer: DomSanitizer) {
    registry.addSvgIconSet(
      domSanitizer.bypassSecurityTrustResourceUrl('./assets/mdi/mdi.svg')
    );
  }

  static initialize(
    config: ConfigService,
    urlService: UrlService,
    info: InfoService,
    lookup: LookupService
  ): () => Observable<unknown> {
    return () => {
      return forkJoin([config.load()])
        .pipe(tap(() => urlService.setConfigService(config)))
        .pipe(tap(() => urlService.prepareUrls()))
        .pipe(switchMap(() => info.load()))
        .pipe(tap((info) => lookup.setLookups(info.lookupMap)));
    };
  }
}
