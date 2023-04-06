import '@utils/protoypes/custom-prototypes';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule, DomSanitizer } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { LoginComponent } from './components/login/login.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { forkJoin, Observable, switchMap, tap } from 'rxjs';
import { ConfigService } from '@services/config.service';
import { UrlService } from '@services/url.service';
import { InfoService } from '@services/info.service';
import { LookupService } from '@services/lookup.service';
import { InputComponent } from '@standalone/components/input/input.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { ControlDirective } from '@standalone/directives/control.directive';
import { ButtonComponent } from '@standalone/components/button/button.component';
import { NgOptimizedImage } from '@angular/common';
import { CookieModule } from 'ngx-cookie';
import { httpInterceptors } from '@http-interceptors/index';
import { AuthService } from '@services/auth.service';
import { CastResponseModule } from 'cast-response';
import { GeneralInterceptor } from '@model-interceptors/general-interceptor';
import { HomeComponent } from './components/home/home.component';
import { SidebarComponent } from '@standalone/components/sidebar/sidebar.component';
import { InputSuffixDirective } from '@standalone/directives/input-suffix.directive';

@NgModule({
  declarations: [AppComponent, LoginComponent, HomeComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    CookieModule.withOptions(),
    BrowserAnimationsModule,
    MatSnackBarModule,
    MatDialogModule,
    InputComponent,
    FormsModule,
    ReactiveFormsModule,
    NgxMaskDirective,
    ControlDirective,
    ButtonComponent,
    NgOptimizedImage,
    CastResponseModule.forRoot([GeneralInterceptor]),
    SidebarComponent,
    MatIconModule,
    InputSuffixDirective,
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: AppModule.initialize,
      deps: [
        ConfigService,
        UrlService,
        InfoService,
        LookupService,
        AuthService,
      ],
      multi: true,
    },
    httpInterceptors,
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
    lookup: LookupService,
    auth: AuthService
  ): () => Observable<unknown> {
    return () => {
      return forkJoin([config.load()])
        .pipe(tap(() => urlService.setConfigService(config)))
        .pipe(tap(() => urlService.prepareUrls()))
        .pipe(switchMap(() => info.load()))
        .pipe(tap((info) => lookup.setLookups(info.lookupMap)))
        .pipe(switchMap(() => auth.validateToken()));
    };
  }
}
