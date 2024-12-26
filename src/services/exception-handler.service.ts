import { HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ErrorCodes } from '@enums/error-codes';
import { AdminResult } from '@models/admin-result';
import { DialogService } from '@services/dialog.service';
import { LangService } from '@services/lang.service';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class ExceptionHandlerService {
  private readonly dialog = inject(DialogService);
  private readonly lang = inject(LangService);
  private readonly auth = inject(AuthService);

  httpExceptionHandle(error: HttpErrorResponse): void {
    // this.dialog.error();
    const hasErrorObject = Object.prototype.hasOwnProperty.call(
      error.error ?? {},
      'eo',
    );

    const hasMessage = Object.prototype.hasOwnProperty.call(
      error.error ?? {},
      'ms',
    );

    if (
      this.auth.isAuthenticated() &&
      error.error.ec === ErrorCodes.ACCESS_TOKEN_TIMED_OUT
    ) {
      this.auth.refreshToken().subscribe();
    }

    if (hasErrorObject) {
      // const content = ;
      const message = new AdminResult()
        .clone<AdminResult>({ ...error.error.eo })
        .getNames();
      this.dialog.error(
        message ||
          this.lang.map.something_wrong_happened.change({
            error_code: error.error.ec,
          }),
      );
      return;
    }

    if (hasMessage) {
      this.dialog.error(error.error.ms);
      return;
    }
    this.dialog.error(error.message);
  }
}
