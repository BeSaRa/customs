import { ChatRoles } from '@enums/chat-roles';
import { ChatContext } from '@enums/chat-context';

export interface ChatMessageContract {
  role: ChatRoles;
  content: string;
  context?: ChatContext;
}
