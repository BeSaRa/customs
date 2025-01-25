import { HttpClient, HttpContext } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { SpeechTokenContract } from '@constants/speech-token-contract';
import { UrlService } from '@services/url.service';
import { AppStore } from '@stores/app.store';
import { catchError, EMPTY, tap } from 'rxjs';
import { NO_ERROR_HANDLE, NO_LOADER_TOKEN } from '@http-contexts/tokens';

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
    const context = new HttpContext()
      .set(NO_LOADER_TOKEN, true)
      .set(NO_ERROR_HANDLE, true);

    const url = this.urlService.AZURE_URLS.SPEECH_TOKEN;
    return this.http
      .get<SpeechTokenContract>(url, { context })
      .pipe(tap(res => this.appStore.updateSpeechToken(res)));
  }
}
