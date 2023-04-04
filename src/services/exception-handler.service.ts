import { inject, Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { DialogService } from '@services/dialog.service';
import { AdminResult } from '@models/admin-result';

@Injectable({
  providedIn: 'root',
})
export class ExceptionHandlerService {
  private readonly dialog = inject(DialogService);

  httpExceptionHandle(error: HttpErrorResponse): void {
    // this.dialog.error();
    const hasErrorObject = Object.prototype.hasOwnProperty.call(
      error.error,
      'eo'
    );

    const hasMessage = Object.prototype.hasOwnProperty.call(error.error, 'ms');

    if (hasErrorObject) {
      // const content = ;

      this.dialog.error(
        new AdminResult().clone<AdminResult>({ ...error.error.eo }).getNames()
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
