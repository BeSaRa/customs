import { ChatMessageContract } from '@contracts/chat-message-contract';
import { ChatContext } from '@enums/chat-context';
import { ChatRoles } from '@enums/chat-roles';
import { ClonerMixin } from '@mixins/cloner-mixin';

export class ChatMessage
  extends ClonerMixin(class {})
  implements ChatMessageContract
{
  role!: ChatRoles;
  content!: string;
  context?: ChatContext | undefined;
}
