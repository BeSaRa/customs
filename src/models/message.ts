import { ClonerMixin } from '@mixins/cloner-mixin';
import { BaseMessage } from '@models/base-message';
import { MessageRoleType } from '@constants/message-role-type';
import { ToolCallContract } from '@contracts/tool-call-contract';

export class Message extends ClonerMixin(BaseMessage) {
  end_turn!: boolean;
  function_call!: unknown;
  tool_calls?: ToolCallContract[];

  constructor(
    public override content = '',
    public override role: MessageRoleType = 'user',
  ) {
    super();
  }
}
