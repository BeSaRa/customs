import { EmbeddedViewRef, Injectable, TemplateRef } from '@angular/core';
import {
  MatSnackBar,
  MatSnackBarConfig,
  MatSnackBarRef,
  TextOnlySnackBar,
} from '@angular/material/snack-bar';
import { ComponentType } from '@angular/cdk/overlay';
import { ToastComponent } from '@standalone/components/toast/toast.component';
import { ToastContract } from '@contracts/toast-contract';

@Injectable({
  providedIn: 'root',
})
export class ToastService implements ToastContract {
  constructor(private snack: MatSnackBar) {}

  open(
    msg: string,
    action?: string,
    config?: MatSnackBarConfig
  ): MatSnackBarRef<TextOnlySnackBar> {
    return this.snack.open(msg, action, config);
  }

  openFromComponent<Component, Data = unknown>(
    component: ComponentType<Component>,
    config: MatSnackBarConfig<Data>
  ): MatSnackBarRef<Component> {
    return this.snack.openFromComponent<Component, Data>(component, {
      ...config,
    });
  }

  openFromTemplate(
    template: TemplateRef<unknown>,
    config?: MatSnackBarConfig
  ): MatSnackBarRef<EmbeddedViewRef<unknown>> {
    return this.snack.openFromTemplate(template, config);
  }

  error<Data = unknown>(
    message: Data,
    config?: Omit<MatSnackBarConfig, 'data'>
  ): MatSnackBarRef<ToastComponent> {
    return this.openFromComponent<ToastComponent, Data>(ToastComponent, {
      ...config,
      panelClass: 'toast-error',
      data: message,
    });
  }

  warning<Data = unknown>(
    message: Data,
    config?: Omit<MatSnackBarConfig, 'data'>
  ): MatSnackBarRef<ToastComponent> {
    return this.openFromComponent<ToastComponent, Data>(ToastComponent, {
      ...config,
      panelClass: 'toast-warning',
      data: message,
    });
  }

  success<Data = unknown>(
    message: Data,
    config?: Omit<MatSnackBarConfig, 'data'>
  ): MatSnackBarRef<ToastComponent> {
    return this.openFromComponent<ToastComponent, Data>(ToastComponent, {
      ...config,
      panelClass: 'toast-success',
      data: message,
    });
  }

  info<Data = unknown>(
    message: Data,
    config?: Omit<MatSnackBarConfig, 'data'>
  ): MatSnackBarRef<ToastComponent> {
    return this.openFromComponent<ToastComponent, Data>(ToastComponent, {
      ...config,
      panelClass: 'toast-info',
      data: message,
    });
  }
}
