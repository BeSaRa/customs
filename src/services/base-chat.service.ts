import { ChatMessageResultContract } from '@contracts/chat-message-result-contract';
import { formatString, formatText } from '@utils/utils';
import { HttpClient, HttpContext } from '@angular/common/http';
import { inject, Injectable, WritableSignal } from '@angular/core';
import { Observable, catchError, map } from 'rxjs';
import { UrlService } from './url.service';
import { AppStore } from '@stores/app.store';
import { Message } from '@models/message';
import { NO_LOADER_TOKEN } from '@http-contexts/tokens';

@Injectable({
  providedIn: 'root',
})
export abstract class BaseChatService {
  protected readonly http = inject(HttpClient);
  protected readonly urlService = inject(UrlService);
  protected readonly store = inject(AppStore);
  abstract messages: WritableSignal<Message[]>;
  abstract status: WritableSignal<boolean>;
  abstract conversationId: WritableSignal<string>;

  sendMessage(
    content: string,
    bot: string,
  ): Observable<ChatMessageResultContract> {
    const url = this.urlService.AZURE_URLS.CHAT_BOT_WEBSITE;
    this.messages.update(messages => [
      ...messages,
      new Message(content, 'user'),
    ]);
    return this.http
      .post<ChatMessageResultContract>(
        url,
        {
          messages: this.messages(),
          ...(this.store.streamId()
            ? { stream_id: this.store.streamId() }
            : null),
          ...(this.conversationId()
            ? { conversation_id: this.conversationId() }
            : null),
        },
        { context: new HttpContext().set(NO_LOADER_TOKEN, true) },
      )
      .pipe(
        catchError(err => {
          new Message().clone({
            content: err.message,
            role: 'error',
          });
          throw new Error(err);
        }),
      )
      .pipe(
        map(res => {
          res.message.content = formatString(
            formatText(res.message.content, res.message),
          );
          res.message = new Message().clone(res.message);
          this.conversationId.set(res.message.conversation_id);
          this.messages.update(messages => [...messages, res.message]);
          return res;
        }),
      );
  }
}
