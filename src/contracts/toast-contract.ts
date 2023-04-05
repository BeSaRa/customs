import {
  MatSnackBarConfig,
  MatSnackBarRef,
  TextOnlySnackBar,
} from '@angular/material/snack-bar';
import { ComponentType } from '@angular/cdk/overlay';
import { ToastComponent } from '@standalone/components/toast/toast.component';
import { EmbeddedViewRef, TemplateRef } from '@angular/core';

export interface ToastContract {
  open(
    msg: string,
    action?: string,
    config?: MatSnackBarConfig
  ): MatSnackBarRef<TextOnlySnackBar>;

  openFromComponent<Component, Data = unknown>(
    component: ComponentType<Component>,
    config: MatSnackBarConfig<Data>
  ): MatSnackBarRef<Component>;

  openFromTemplate(
    template: TemplateRef<unknown>,
    config?: MatSnackBarConfig
  ): MatSnackBarRef<EmbeddedViewRef<unknown>>;

  error<Data = unknown>(
    message: Data,
    config?: Omit<MatSnackBarConfig, 'data'>
  ): MatSnackBarRef<ToastComponent>;

  warning<Data = unknown>(
    message: Data,
    config?: Omit<MatSnackBarConfig, 'data'>
  ): MatSnackBarRef<ToastComponent>;

  success<Data = unknown>(
    message: Data,
    config?: Omit<MatSnackBarConfig, 'data'>
  ): MatSnackBarRef<ToastComponent>;

  info<Data = unknown>(
    message: Data,
    config?: Omit<MatSnackBarConfig, 'data'>
  ): MatSnackBarRef<ToastComponent>;
}
