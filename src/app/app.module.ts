import { NgOptimizedImage } from '@angular/common';
import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDateFnsModule } from '@angular/material-date-fns-adapter';
import {
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
  MatOptionModule,
} from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioButton, MatRadioGroup } from '@angular/material/radio';
import {
  MAT_SELECT_SCROLL_STRATEGY_PROVIDER,
  MatSelectModule,
} from '@angular/material/select';
import {
  MAT_SNACK_BAR_DEFAULT_OPTIONS,
  MatSnackBarModule,
} from '@angular/material/snack-bar';
import { MAT_TOOLTIP_DEFAULT_OPTIONS } from '@angular/material/tooltip';
import { BrowserModule, DomSanitizer } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouteReuseStrategy } from '@angular/router';
import { Config } from '@constants/config';
import { PaginatorLocal } from '@constants/paginator-local';
import { httpInterceptors } from '@http-interceptors/index';
import { GeneralInterceptor } from '@model-interceptors/general-interceptor';
import { CustomInvestigationRouteReuseStrategy } from '@models/custom-investigation-route-reuse-strategy';
import { AuthService } from '@services/auth.service';
import { ConfigService } from '@services/config.service';
import { InfoService } from '@services/info.service';
import { LangService } from '@services/lang.service';
import { LookupService } from '@services/lookup.service';
import { MenuItemService } from '@services/menu-item.service';
import { PenaltyDecisionService } from '@services/penalty-decision.service';
import { UrlService } from '@services/url.service';
import { ButtonComponent } from '@standalone/components/button/button.component';
import { ChatAiComponent } from '@standalone/components/chat-ai/chat-ai.component';
import { InputComponent } from '@standalone/components/input/input.component';
import { LoadingComponent } from '@standalone/components/loading/loading.component';
import { NavbarComponent } from '@standalone/components/navbar/navbar.component';
import { SidebarComponent } from '@standalone/components/sidebar/sidebar.component';
import { VersionComponent } from '@standalone/components/version/version.component';
import { ControlDirective } from '@standalone/directives/control.directive';
import { InputSuffixDirective } from '@standalone/directives/input-suffix.directive';
import '@utils/prototypes/custom-prototypes';
import { CastResponseModule } from 'cast-response';
import { enUS } from 'date-fns/locale';
import { CookieModule } from 'ngx-cookie';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { NgProgressModule } from 'ngx-progressbar';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { forkJoin, Observable, switchMap, tap } from 'rxjs';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ExternalLoginComponent } from './components/external-login/external-login.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ExternalLoginComponent,
    HomeComponent,
  ],
  bootstrap: [AppComponent],
  imports: [
    BrowserModule,
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
    MatRadioButton,
    MatRadioGroup,
    NgProgressModule,
    MatDateFnsModule,
    LoadingComponent,
    VersionComponent,
    ChatAiComponent,
  ],
  providers: [
    MAT_SELECT_SCROLL_STRATEGY_PROVIDER,
    {
      provide: APP_INITIALIZER,
      useFactory: AppModule.initialize,
      deps: [
        LangService,
        ConfigService,
        UrlService,
        InfoService,
        LookupService,
        AuthService,
        MenuItemService,
        PenaltyDecisionService,
      ],
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
    provideHttpClient(withInterceptorsFromDi()),
    {
      provide: RouteReuseStrategy,
      useClass: CustomInvestigationRouteReuseStrategy,
    },
  ],
})
export class AppModule {
  constructor(registry: MatIconRegistry, domSanitizer: DomSanitizer) {
    registry.addSvgIconSet(
      domSanitizer.bypassSecurityTrustResourceUrl('./assets/mdi/mdi.svg'),
    );
  }

  static initialize(
    _lang: LangService,
    config: ConfigService,
    url: UrlService,
    info: InfoService,
    lookup: LookupService,
    auth: AuthService,
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
