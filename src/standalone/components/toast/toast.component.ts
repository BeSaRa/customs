import { Component, Inject, ViewEncapsulation } from '@angular/core';

import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [],
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ToastComponent {
  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: string) {}
}
