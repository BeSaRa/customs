import { ComponentType } from '@angular/cdk/overlay';
import { TemplateRef } from '@angular/core';
import { MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { DialogComponent } from '@standalone/components/dialog/dialog.component';
import { UserClick } from '@enums/user-click';

export interface DialogContract {
  open<T, D = unknown, R = unknown>(
    template: ComponentType<T> | TemplateRef<T>,
    config?: MatDialogConfig<D>
  ): MatDialogRef<T, R>;

  error<R = unknown>(
    content: string,
    title?: string,
    disableClose?: boolean
  ): MatDialogRef<DialogComponent, R>;

  warning<R = unknown>(
    content: string,
    title?: string,
    disableClose?: boolean
  ): MatDialogRef<DialogComponent, R>;

  success<R = unknown>(
    content: string,
    title?: string,
    disableClose?: boolean
  ): MatDialogRef<DialogComponent, R>;

  info<R = unknown>(
    content: string,
    title?: string,
    disableClose?: boolean
  ): MatDialogRef<DialogComponent, R>;

  confirm(
    content: string,
    title?: string,
    buttons?: { yes: string; no: string },
    disableClose?: boolean
  ): MatDialogRef<DialogComponent, UserClick>;
}
