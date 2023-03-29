import { Component, HostListener, inject, OnInit } from '@angular/core';
import { DialogService } from '@services/dialog.service';
import { LangService } from '@services/lang.service';
import { LocalizationService } from '@services/localization.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  dialog = inject(DialogService);
  lang = inject(LangService);
  localizationService = inject(LocalizationService);

  ngOnInit(): void {
    this.localizationService.load().subscribe((value) => {
      console.log({ value });
    });
  }

  @HostListener('window:keydown.alt.control.a')
  openAddLanguage(): void {
    // TODO: should check if the user authenticated first before display for him the
  }
}
