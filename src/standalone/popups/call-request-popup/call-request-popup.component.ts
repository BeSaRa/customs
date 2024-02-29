import { Component, inject } from '@angular/core';
import { IconButtonComponent } from '@standalone/components/icon-button/icon-button.component';
import { MatDialogClose } from '@angular/material/dialog';
import { ButtonComponent } from '@standalone/components/button/button.component';
import { LangService } from '@services/lang.service';
import { Subject } from 'rxjs';
import { CallRequestService } from '@services/call-request.service';

@Component({
  selector: 'app-call-request-popup',
  standalone: true,
  imports: [IconButtonComponent, MatDialogClose, ButtonComponent],
  templateUrl: './call-request-popup.component.html',
  styleUrl: './call-request-popup.component.scss',
})
export class CallRequestPopupComponent {
  lang = inject(LangService);
  save$: Subject<void> = new Subject();
  callRequestService = inject(CallRequestService);
}
