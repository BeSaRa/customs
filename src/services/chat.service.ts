import { Injectable, signal } from '@angular/core';
import { BaseChatService } from '@services/base-chat.service';
import { Message } from '@models/message';

@Injectable({
  providedIn: 'root',
})
export class ChatService extends BaseChatService {
  messages = signal<Message[]>([]);
  status = signal<boolean>(false);
  conversationId = signal<string>('');
}
