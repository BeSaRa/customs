import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { DefaultDialogDataContract } from '@contracts/default-dialog-data-contract';
import { DialogContract } from '@contracts/dialog-contract';

type DialogSelectedClasses = {
  bg: string;
  text: string;
  icon: string;
};

@Component({
  selector: 'app-dialog',
  standalone: true,
  imports: [CommonModule, MatIconModule],
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
    },
    success: {
      bg: 'bg-green-500',
      text: 'text-green-500',
      icon: 'check-circle-outline',
    },
    warning: {
      bg: 'bg-yellow-500',
      text: 'text-yellow-500',
      icon: 'alert-outline',
    },
    error: {
      bg: 'bg-red-500',
      text: 'text-red-500',
      icon: 'alert-circle-outline',
    },
    confirm: {
      bg: 'bg-primary',
      text: 'text-primary',
      icon: 'help-circle-outline',
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
}
