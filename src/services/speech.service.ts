import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { SpeechTokenContract } from '@constants/speech-token-contract';
import { UrlService } from '@services/url.service';
import { AppStore } from '@stores/app.store';

@Injectable({
  providedIn: 'root',
})
export class SpeechService {
  private readonly http = inject(HttpClient);
  private urlService = inject(UrlService);
  private readonly appStore = inject(AppStore);

  generateSpeechToken(): Observable<SpeechTokenContract> {
    return this.http
      .get<SpeechTokenContract>(
        'https://ebla-ai-demo-002.azurewebsites.net/api/v1/speech/token',
      )
      .pipe(tap(res => this.appStore.updateSpeechToken(res)));
  }
}
