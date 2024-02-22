import { ClonerMixin } from '@mixins/cloner-mixin';
import { ChatMessageWrapperContract } from '@contracts/chat-message-wrapper-contract';
import { ChatContext } from '@enums/chat-context';
import { ChatMessage } from './chat-message';

export class ChatMessageWrapper
  extends ClonerMixin(class {})
  implements ChatMessageWrapperContract
{
  context!: ChatContext;
  messages!: ChatMessage[];
}
