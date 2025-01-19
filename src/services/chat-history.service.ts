import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { UrlService } from './url.service';
import { Observable } from 'rxjs';
import { CastResponse } from 'cast-response';
import { Conversation } from '@models/conversation';
import { FeedbackChat } from '@enums/feedback-chat';

@Injectable({
  providedIn: 'root',
})
export class ChatHistoryService {
  private readonly http = inject(HttpClient);
  private readonly urlService = inject(UrlService);

  @CastResponse(() => Conversation)
  getAllConversations(botName?: string): Observable<Conversation[]> {
    const url = this.urlService.AZURE_URLS.ALL_CONVERSATIONS;
    let params = new HttpParams();
    if (botName) {
      params = params.set('bot_name', botName);
    }
    return this.http.get<Conversation[]>(url, { params: params });
  }
  addFeedback(
    conversationId: string,
    feedback: FeedbackChat,
  ): Observable<string> {
    const url = this.urlService.AZURE_URLS.ADD_FEEDBACK;
    const params = new HttpParams()
      .set('conv_id', conversationId)
      .set('feedback', feedback);
    return this.http.post<string>(url, null, { params: params });
  }
}
