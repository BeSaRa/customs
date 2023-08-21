import { Component, inject } from '@angular/core';
import { LangService } from '@services/lang.service';
import { AppIcons } from '@constants/app-icons';

@Component({
  selector: 'app-investigation',
  templateUrl: './investigation.component.html',
  styleUrls: ['./investigation.component.scss'],
})
export class InvestigationComponent {
  lang = inject(LangService);
  protected readonly AppIcons = AppIcons;
}
