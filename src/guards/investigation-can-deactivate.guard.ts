import { CanDeactivateFn } from '@angular/router';
import { InvestigationComponent } from '@modules/electronic-services/components/investigation/investigation.component';
import { inject } from '@angular/core';
import { DialogService } from '@services/dialog.service';
import { map } from 'rxjs/operators';
import { UserClick } from '@enums/user-click';
import { LangService } from '@services/lang.service';

export const investigationCanDeactivateGuard: CanDeactivateFn<
  InvestigationComponent
> = component => {
  const dialog = inject(DialogService);
  const lang = inject(LangService);
  return component.form.dirty
    ? dialog
        .confirm(lang.map.msg_unsaved_changes)
        .afterClosed()
        .pipe(map(click => click === UserClick.YES))
    : true;
};
