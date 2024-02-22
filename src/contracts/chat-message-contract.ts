import { ChatRoles } from '@enums/chat-roles';

export interface ChatMessageContract {
  role: ChatRoles;
  content: string;
}
