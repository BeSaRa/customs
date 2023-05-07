import { NgOptimizedImage } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { MatPaginatorIntl } from '@angular/material/paginator';
import {
  MAT_SNACK_BAR_DEFAULT_OPTIONS,
  MatSnackBarModule,
} from '@angular/material/snack-bar';
import { MAT_TOOLTIP_DEFAULT_OPTIONS } from '@angular/material/tooltip';
import { BrowserModule, DomSanitizer } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PaginatorLocal } from '@constants/paginator-local';
import { httpInterceptors } from '@http-interceptors/index';
import { GeneralInterceptor } from '@model-interceptors/general-interceptor';
import { AuthService } from '@services/auth.service';
import { ConfigService } from '@services/config.service';
import { InfoService } from '@services/info.service';
import { LookupService } from '@services/lookup.service';
import { MenuItemService } from '@services/menu-item.service';
import { UrlService } from '@services/url.service';
import { ButtonComponent } from '@standalone/components/button/button.component';
import { InputComponent } from '@standalone/components/input/input.component';
import { NavbarComponent } from '@standalone/components/navbar/navbar.component';
import { SidebarComponent } from '@standalone/components/sidebar/sidebar.component';
import { ControlDirective } from '@standalone/directives/control.directive';
import { InputSuffixDirective } from '@standalone/directives/input-suffix.directive';
import '@utils/protoypes/custom-prototypes';
import { CastResponseModule } from 'cast-response';
import { Ng2FlatpickrModule } from 'ng2-flatpickr';
import { CookieModule } from 'ngx-cookie';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { Observable, forkJoin, switchMap, tap } from 'rxjs';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';

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
    Ng2FlatpickrModule,
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
        MenuItemService,
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
        position: 'above',
      },
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
    url: UrlService,
    info: InfoService,
    lookup: LookupService,
    auth: AuthService
  ): () => Observable<unknown> {
    return () => {
      return forkJoin([config.load()])
        .pipe(tap(() => url.setConfigService(config)))
        .pipe(tap(() => url.prepareUrls()))
        .pipe(switchMap(() => info.load()))
        .pipe(tap((info) => lookup.setLookups(info.lookupMap)))
        .pipe(switchMap(() => auth.validateToken()));
    };
  }
}
