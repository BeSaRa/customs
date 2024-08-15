import { inject, Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { DialogService } from '@services/dialog.service';
import { AdminResult } from '@models/admin-result';
import { LangService } from '@services/lang.service';

@Injectable({
  providedIn: 'root',
})
export class ExceptionHandlerService {
  private readonly dialog = inject(DialogService);
  private readonly lang = inject(LangService);
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
