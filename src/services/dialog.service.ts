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

@Injectable({
  providedIn: 'root',
})
export class DialogService implements DialogContract {
  constructor(private dialog: MatDialog, private lang: LangService) {
    this.listenToLanguageChanges();
  }

  error<R = unknown>(
    content: string,
    title?: string,
    disableClose = true
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
      }
    );
  }

  warning<R = unknown>(
    content: string,
    title?: string,
    disableClose = true
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
      }
    );
  }

  success<R = unknown>(
    content: string,
    title?: string,
    disableClose = true
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
      }
    );
  }

  info<R = unknown>(
    content: string,
    title?: string,
    disableClose = true
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
      }
    );
  }

  confirm(
    content: string,
    title?: string,
    buttons: { yes: string; no: string } = { yes: 'Yes', no: 'No' },
    disableClose = true
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

  open<T, D = unknown, R = unknown>(
    template: ComponentType<T> | TemplateRef<T>,
    config?: MatDialogConfig<D>
  ): MatDialogRef<T, R> {
    return this.dialog.open<T, D, R>(template, {
      ...config,
      direction: this.lang.getCurrent().direction,
    });
  }

  private listenToLanguageChanges() {
    this.lang.change$.subscribe((current) => {
      const overlayWrapper = document.querySelectorAll<HTMLDivElement>(
        '.cdk-global-overlay-wrapper'
      );
      overlayWrapper.forEach((item: HTMLDivElement) => {
        item.dir = current.direction;
      });
    });
  }
}
