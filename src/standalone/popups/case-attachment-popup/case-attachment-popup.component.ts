import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { OnDestroyMixin } from '@mixins/on-destroy-mixin';

@Component({
  selector: 'app-case-attachment-popup',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './case-attachment-popup.component.html',
  styleUrls: ['./case-attachment-popup.component.scss'],
})
export class CaseAttachmentPopupComponent extends OnDestroyMixin(class {}) implements OnInit {
  data: { caseId: string } = inject(MAT_DIALOG_DATA);

  ngOnInit(): void {
    console.log(this.data.caseId);
  }
}
