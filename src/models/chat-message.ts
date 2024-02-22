import { ChatMessageContract } from '@contracts/chat-message-contract';
import { ChatRoles } from '@enums/chat-roles';
import { ClonerMixin } from '@mixins/cloner-mixin';

export class ChatMessage
  extends ClonerMixin(class {})
  implements ChatMessageContract
{
  role!: ChatRoles;
  content!: string;
}
