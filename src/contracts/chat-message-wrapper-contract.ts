import { ChatContext } from '@enums/chat-context';
import { ChatMessage } from '@models/chat-message';

export interface ChatMessageWrapperContract {
  context: ChatContext;
  messages: ChatMessage[];
}
