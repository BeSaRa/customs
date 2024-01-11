import '@utils/protoypes/custom-prototypes';
import { NgOptimizedImage } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { MAT_SNACK_BAR_DEFAULT_OPTIONS, MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserModule, DomSanitizer } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { httpInterceptors } from '@http-interceptors/index';
import { GeneralInterceptor } from '@model-interceptors/general-interceptor';
import { AuthService } from '@services/auth.service';
import { ConfigService } from '@services/config.service';
import { InfoService } from '@services/info.service';
import { LookupService } from '@services/lookup.service';
import { UrlService } from '@services/url.service';
import { ButtonComponent } from '@standalone/components/button/button.component';
import { InputComponent } from '@standalone/components/input/input.component';
import { SidebarComponent } from '@standalone/components/sidebar/sidebar.component';
import { ControlDirective } from '@standalone/directives/control.directive';
import { InputSuffixDirective } from '@standalone/directives/input-suffix.directive';
import { MenuItemService } from '@services/menu-item.service';
import { NavbarComponent } from '@standalone/components/navbar/navbar.component';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { PaginatorLocal } from '@constants/paginator-local';
import { MAT_TOOLTIP_DEFAULT_OPTIONS } from '@angular/material/tooltip';
import { AppRoutingModule } from './app-routing.module';
import { CookieModule } from 'ngx-cookie';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { CastResponseModule } from 'cast-response';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { forkJoin, Observable, switchMap, tap } from 'rxjs';
import { MAT_SELECT_SCROLL_STRATEGY_PROVIDER, MatSelectModule } from '@angular/material/select';
import { MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatOptionModule } from '@angular/material/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { LangService } from '@services/lang.service';
import { NgProgressModule } from 'ngx-progressbar';
import { MatDateFnsModule } from '@angular/material-date-fns-adapter';
import { enUS } from 'date-fns/locale';
import { Config } from '@constants/config';
import { LoadingComponent } from '@standalone/components/loading/loading.component';
import { VersionComponent } from '@standalone/components/version/version.component';

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
    NavbarComponent,
    NgScrollbarModule,
    MatSelectModule,
    MatOptionModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    NgProgressModule,
    MatDateFnsModule,
    LoadingComponent,
    VersionComponent,
  ],
  providers: [
    MAT_SELECT_SCROLL_STRATEGY_PROVIDER,
    {
      provide: APP_INITIALIZER,
      useFactory: AppModule.initialize,
      deps: [LangService, ConfigService, UrlService, InfoService, LookupService, AuthService, MenuItemService],
      multi: true,
    },
    {
      provide: MatPaginatorIntl,
      useClass: PaginatorLocal,
    },
    {
      provide: MAT_SNACK_BAR_DEFAULT_OPTIONS,
      useValue: {
        duration: 2000,
        verticalPosition: 'top',
      },
    },
    {
      provide: MAT_TOOLTIP_DEFAULT_OPTIONS,
      useValue: {
        duration: 2000,
        verticalPosition: 'top',
      },
    },

    httpInterceptors,
    provideNgxMask(),
    { provide: MAT_DATE_LOCALE, useValue: enUS },
    { provide: MAT_DATE_FORMATS, useValue: Config.DATE_FORMAT_OVERRIDE },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor(registry: MatIconRegistry, domSanitizer: DomSanitizer) {
    registry.addSvgIconSet(domSanitizer.bypassSecurityTrustResourceUrl('./assets/mdi/mdi.svg'));
  }

  static initialize(
    _lang: LangService,
    config: ConfigService,
    url: UrlService,
    info: InfoService,
    lookup: LookupService,
    auth: AuthService
  ): () => Observable<unknown> {
    return () =>
      forkJoin([config.load()])
        .pipe(tap(() => url.setConfigService(config)))
        .pipe(tap(() => url.prepareUrls()))
        .pipe(switchMap(() => info.load()))
        .pipe(tap(info => lookup.setLookups(info.lookupMap)))
        .pipe(switchMap(() => auth.validateToken()));
  }
}
