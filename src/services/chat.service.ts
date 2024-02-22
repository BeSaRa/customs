import { inject, Injectable } from '@angular/core';
import { RegisterServiceMixin } from '@mixins/register-service-mixin';
import { ServiceContract } from '@contracts/service-contract';
import { Observable } from 'rxjs';
import { HttpClient, HttpContext } from '@angular/common/http';
import { UrlService } from '@services/url.service';
import { CastResponse } from 'cast-response';
import { ChatMessage } from '@models/chat-message';
import { NO_LOADER_TOKEN } from '@http-contexts/tokens';
import { ChatMessageWrapper } from '@models/chat-message-wrapper';

@Injectable({
  providedIn: 'root',
})
export class ChatService
  extends RegisterServiceMixin(class {})
  implements ServiceContract
{
  serviceName = 'ChatService';
  private http = inject(HttpClient);
  private urlService = inject(UrlService);

  @CastResponse(() => ChatMessage, { unwrap: 'rs' })
  send(message: ChatMessageWrapper): Observable<ChatMessage> {
    return this.http.post<ChatMessage>(this.urlService.URLS.CHAT, message, {
      context: new HttpContext().set(NO_LOADER_TOKEN, true),
    });
  }
}
