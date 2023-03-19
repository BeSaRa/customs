import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { DefaultDialogDataContract } from '@contracts/default-dialog-data-contract';
import { DialogContract } from '@contracts/dialog-contract';
import { ButtonComponent } from '@standalone/button/button.component';
import { ButtonTypeContract } from '@contracts/button-type-contract';

type DialogSelectedClasses = {
  bg: string;
  text: string;
  icon: string;
  btn: keyof ButtonTypeContract;
  secondBtn?: keyof ButtonTypeContract;
};

@Component({
  selector: 'app-dialog',
  standalone: true,
  imports: [CommonModule, MatIconModule, ButtonComponent],
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss'],
})
export class DialogComponent {
  dialogTypes: Record<
    keyof Omit<DialogContract, 'open'>,
    DialogSelectedClasses
  > = {
    info: {
      bg: 'bg-sky-500',
      text: 'text-sky-500',
      icon: 'information-outline',
      btn: 'info',
      secondBtn: 'info-outline',
    },
    success: {
      bg: 'bg-green-500',
      text: 'text-green-500',
      icon: 'check-circle-outline',
      btn: 'success',
      secondBtn: 'success-outline',
    },
    warning: {
      bg: 'bg-yellow-500',
      text: 'text-yellow-500',
      icon: 'alert-outline',
      btn: 'warning',
      secondBtn: 'warning-outline',
    },
    error: {
      bg: 'bg-red-500',
      text: 'text-red-500',
      icon: 'alert-circle-outline',
      btn: 'error',
      secondBtn: 'error-outline',
    },
    confirm: {
      bg: 'bg-primary',
      text: 'text-primary',
      icon: 'help-circle-outline',
      btn: 'primary',
      secondBtn: 'primary-outline',
    },
  };
  selectedClass: DialogSelectedClasses = this.dialogTypes[this.data.type];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DefaultDialogDataContract<string>,
    private dialogRef: MatDialogRef<unknown>
  ) {}

  close(): void {
    this.dialogRef.close();
  }

  yes(): void {
    this.dialogRef.close();
  }

  no(): void {
    this.dialogRef.close();
  }

  log($event: MouseEvent) {
    console.log($event);
  }
}
