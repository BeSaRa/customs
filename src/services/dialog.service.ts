import { ComponentType } from '@angular/cdk/portal';
import { Injectable, TemplateRef } from '@angular/core';
import {
  MatDialog,
  MatDialogConfig,
  MatDialogRef,
} from '@angular/material/dialog';
import { DialogContract } from '@contracts/dialog-contract';
import { DialogComponent } from '@standalone/components/dialog/dialog.component';
import { DefaultDialogDataContract } from '@contracts/default-dialog-data-contract';
import { DialogType } from '@enums/dialog-type';
import { LangService } from '@services/lang.service';
import { UserClick } from '@enums/user-click';
import { LangKeysContract } from '@contracts/lang-keys-contract';
import { ButtonTypeContract } from '@contracts/button-type-contract';

@Injectable({
  providedIn: 'root',
})
export class DialogService implements DialogContract {
  constructor(
    private dialog: MatDialog,
    private lang: LangService,
  ) {
    this.listenToLanguageChanges();
  }

  error<R = unknown>(
    content: string,
    title?: string,
    disableClose = true,
  ): MatDialogRef<DialogComponent, R> {
    return this.open<DialogComponent, DefaultDialogDataContract<string>, R>(
      DialogComponent,
      {
        disableClose,
        data: {
          title,
          content,
          type: DialogType.ERROR,
        },
      },
    );
  }

  warning<R = unknown>(
    content: string,
    title?: string,
    disableClose = true,
  ): MatDialogRef<DialogComponent, R> {
    return this.open<DialogComponent, DefaultDialogDataContract<string>, R>(
      DialogComponent,
      {
        direction: this.lang.getCurrent().direction,
        disableClose,
        data: {
          title,
          content,
          type: DialogType.WARNING,
        },
      },
    );
  }

  success<R = unknown>(
    content: string,
    title?: string,
    disableClose = true,
  ): MatDialogRef<DialogComponent, R> {
    return this.open<DialogComponent, DefaultDialogDataContract<string>, R>(
      DialogComponent,
      {
        direction: this.lang.getCurrent().direction,
        disableClose,
        data: {
          title,
          content,
          type: DialogType.SUCCESS,
        },
      },
    );
  }

  info<R = unknown>(
    content: string,
    title?: string,
    disableClose = true,
  ): MatDialogRef<DialogComponent, R> {
    return this.open<DialogComponent, DefaultDialogDataContract<string>, R>(
      DialogComponent,
      {
        direction: this.lang.getCurrent().direction,
        disableClose,
        data: {
          title,
          content,
          type: DialogType.INFO,
        },
      },
    );
  }

  confirm(
    content: string,
    title?: string,
    buttons: {
      yes: string | keyof LangKeysContract;
      no: string | keyof LangKeysContract;
    } = { yes: 'yes', no: 'no' },
    disableClose = true,
  ): MatDialogRef<DialogComponent, UserClick> {
    return this.open<
      DialogComponent,
      DefaultDialogDataContract<string>,
      UserClick
    >(DialogComponent, {
      direction: this.lang.getCurrent().direction,
      disableClose,
      data: {
        title,
        content,
        buttons,
        type: DialogType.CONFIRM,
      },
    });
  }

  multi(
    content: string,
    title?: string,
    multiButtons: {
      key: string | keyof LangKeysContract;
      value: unknown;
      type: keyof ButtonTypeContract;
    }[] = [
      { key: 'yes', value: UserClick.YES, type: 'primary' },
      { key: 'no', value: UserClick.NO, type: 'primary-outline' },
    ],
    disableClose = true,
  ): MatDialogRef<DialogComponent, UserClick> {
    return this.open<
      DialogComponent,
      DefaultDialogDataContract<string>,
      UserClick
    >(DialogComponent, {
      direction: this.lang.getCurrent().direction,
      disableClose,
      data: {
        title,
        content,
        type: DialogType.MULTI,
        multiButtons,
      },
    });
  }

  open<T, D = unknown, R = unknown>(
    template: ComponentType<T> | TemplateRef<T>,
    config?: MatDialogConfig<D>,
  ): MatDialogRef<T, R> {
    return this.dialog.open<T, D, R>(template, {
      disableClose: true,
      direction: this.lang.getCurrent().direction,
      ...config,
    });
  }

  private listenToLanguageChanges() {
    this.lang.change$.subscribe(current => {
      const overlayWrapper = document.querySelectorAll<HTMLDivElement>(
        '.cdk-global-overlay-wrapper, .cdk-overlay-pane',
      );
      overlayWrapper.forEach((item: HTMLDivElement) => {
        item.dir = current.direction;
      });
    });
  }
}
