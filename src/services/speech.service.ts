import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { SpeechTokenContract } from '@constants/speech-token-contract';
import { UrlService } from '@services/url.service';
import { AppStore } from '@stores/app.store';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SpeechService {
  private readonly http = inject(HttpClient);
  private urlService = inject(UrlService);
  private readonly appStore = inject(AppStore);

  constructor() {
    this.generateSpeechToken().subscribe();
  }

  generateSpeechToken(reload = true) {
    const url = this.urlService.AZURE_URLS.SPEECH_TOKEN;
    return this.http
      .get<SpeechTokenContract>(url)
      .pipe(tap(res => this.appStore.updateSpeechToken(res)));
  }
}
