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
import { Observable, of } from 'rxjs';

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
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      multi: true,
      useFactory: AppModule.initialize,
      deps: [],
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor(registry: MatIconRegistry, domSanitizer: DomSanitizer) {
    registry.addSvgIconSet(
      domSanitizer.bypassSecurityTrustResourceUrl('./assets/mdi/mdi.svg')
    );
  }

  static initialize(): () => Observable<boolean> {
    return () => {
      return of(true);
    };
  }
}
